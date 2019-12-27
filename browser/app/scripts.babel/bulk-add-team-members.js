const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// add box for copy-pasting user list
setInterval(() => {
  if ($('.ts-add-members-header').length == 0)
    return;
  if ($('#refined-bulk-add-team-members-form').length != 0)
    return;

  const html = `
  <div id="refined-bulk-add-team-members-form">
  <textarea placeholder="alice@acme.com ; bob@acme.com ;"></textarea>
  <input class="ts-btn ts-btn-fluent ts-btn-fluent-primary" type="submit" value="Bulk import">
  <small>Bulk import provided by chrome extension: "Refined Microsoft Teams"</small>
  <div class="msgs"></div>
  </div>
  `;
  $(html).insertAfter('.ts-add-members-header');
  $('#refined-bulk-add-team-members-form input').click(onSubmitRefinedBulkAddTeamMembersForm);
}, 1000);

function onSubmitRefinedBulkAddTeamMembersForm() {
  const value = $('#refined-bulk-add-team-members-form textarea').val();
  const emails = value
    .replace('\n', ';')
    .split(';')
    .map((email) => email.trim())
    .filter((email) => email.length > 0);
  $('#refined-bulk-add-team-members-form textarea').val('');
  addMembersToTeam(emails);
}

function addMsg(msg) {
  $('#refined-bulk-add-team-members-form .msgs').prepend("<p>" + msg + "</p>");
}

function addMembersToTeam(emails) {
  const channelService = window.angular.element(document.body).injector().get('channelService');
  const teamMembershipService = window.angular.element(document.body).injector().get('teamMembershipService');
  const peopleService = window.angular.element(document.body).injector().get('peopleService');

  const getMembers = emails.map((email, i) => {
    return delay(i * 100) // 100ms delay between search requests
      .then(() => peopleService.searchPeopleOnServer(email))
      .then((res) => {
        if (!!res && !!res.results && res.results.length > 0)
          return res.results[0].mri;
        addMsg("User not found: " + email);
        return null;
      })
      .catch((err) => null);
  });

  Promise.all(getMembers)
    .then((members) => members.filter((m) => m != null))
    .then((members) => members.map((mri) => ({
      mri: mri,
      role: 0,
    })))
    .then((members) => {
      const team = channelService.getCurrentTeamAndChannel().team;
      return teamMembershipService.addTeamUsers(team, members);
    })
    .then((res) => {
      if (res.addedMembers == null)
        res.addedMembers == [];
      addMsg("Added " + res.addedMembers.length + " users.");
    })
    .catch((err) => {
      addMsg("Error: " + err);
    });
}

// debug
function getMethods(obj) {
  var res = [];
  for (var m in obj) {
    if (typeof obj[m] == "function") {
      res.push(m)
    }
  }
  return res;
}