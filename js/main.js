
$ = {};

if($.redirect==undefined)
$.redirect = (url) => {
    document.location = url;
}

if($.toggleClass==undefined)
$.toggleClass = (el , className) => {
  el.classList.toggle(className);
};

$.select = (selector) => {
  return document.querySelector(selector);
};

if($.selectAll==undefined)
$.selectAll = (selector) => {
  return document.querySelectorAll(selector);
};

let playerPrfo = {};
let profLister = [];

let invites = [];
let sentInvites = [];

function init() {
  axios.post('/check-invite',{}).then((res)=>{
    console.log(res.data);
    playerPrfo = res.data;
    invites = res.data.invites;
    sentInvites = res.data.sentInvites;
    for(let listener of profLister)
      try {
        listener(res.data);
      }catch(e){  }

  });
}

function updateInvitesList(res) {
  let html = '';
  let invStatus = {
    '1' : 'received' ,
    '2' : 'accepted' ,
    '3' : 'accepted & verified' ,
    '4' : 'rejected'
  };

  for( invt of invites) {
    html+=`<div class="card-item"> 
        <div class="card-item-title" > Invitation from ` + invt.from + `</div>
        <div class="card-item-body"> Invite has been `+invStatus[invt.status]+` </div> `;
    html+= invt.status==1 ? 
          `<button class="btn blue" onclick='acceptInv("`+invt.inviteId+`")'>Accept</button>
          <button class="btn red" onclick='rejectInv("`+invt.inviteId+`")'>Reject</button>` :
          invt.status == 4 ? `<button class="btn red" onclick='deleteInv("`+invt.inviteId+`")'>Delete</button>` : 
          `<label class="btn warn" onclick='openGame("`+ invt.gameId +`")'> Open Game </label>
           <button class="btn red" onclick='deleteInv("`+invt.inviteId+`")'>Delete</button>`
          ;

    html+=`</div>`;
  }
  
  console.log(html);
  $.select('.invitation-list').innerHTML = html;
}

function updateSentInvitesList(res) {
  let html = '';
  let invStatus = {
    '1' : 'sent' ,
    '2' : 'accepted' ,
    '3' : 'accepted & verified' ,
    '4' : 'rejected'
  };

  for( invt of sentInvites) {
    html+=`<div class="card-item"> 
        <div class="card-item-title" > Invitation sent to ` + invt.to + `</div>
        <div class="card-item-body"> Invite has been `+invStatus[invt.status]+` </div>`;
    html+= invt.status==1 ? 
          `<button class="btn red" onclick='cancelInv("`+invt.inviteId+`")'>Cancel</button>` : 
          invt.status == 4 ?`
          <button class="btn red" onclick='deleteInv("`+invt.inviteId+`")'>Delete</button>` :
          `<label class="btn warn" onclick='openGame("`+ invt.gameId +`")'> Open Game </label>
           <button class="btn red" onclick='deleteInv("`+invt.inviteId+`")'>Delete</button>`
          ;
    html+=`</div>`;
  }
  
  console.log(html);
  $.select('.sent-invitation-list').innerHTML = html;
}
profLister.push(updateSentInvitesList);
profLister.push(updateInvitesList);

function openGame(id) {
  window.open('start?gameId='+id,'_blank');
}

function acceptInv(id) {
  console.log('aceepting '+id);
  axios.post('/accept-invite',{id:id}).then((res)=>{
    console.log('accepted : '+JSON.stringify(res.data));
    for(let invt of invites)
    if(invt.inviteId==id)
      invt.status = 3;

    updateInvitesList();
  });

}
function deleteInv(id) {
  console.log('deleting '+id);
  axios.post('/edit-invite',{id:id,action:'delete'}).then((res)=>{
    console.log('deleted : '+JSON.stringify(res.data));
    init();
    //updateInvitesList();
  });

}
function rejectInv(id) {
  console.log('deleting '+id);
  axios.post('/edit-invite',{id:id,action:'reject'}).then((res)=>{
    console.log('rejected : '+JSON.stringify(res.data));
    init();
    //updateInvitesList();
  });

}
init();

let tipsList = [];
tipsList.push({
    id:1 ,
    tip:`Welcome !!! Enter unique login id and click start. This id will be used by others while sending you the invite.`,
    image:'docs/screens/login1.png' 
});
tipsList.push({
    id:2 ,
    tip:`Click On 'Start New Game' button to send invitation to other players.`,
    image:'docs/screens/start-new0.png' 
});

tipsList.push({
  id:3 ,
  tip:`Enter other players login id which he used while login to send them invite. Click on send button`,
  image:'docs/screens/start-new1.png' 
});
tipsList.push({
  id:4 ,
  tip:`Now tell other user to check 'Recieved Invitations' tab. He will see invitation sent by you as below.</br>
  Request him to accept your invitation by clicking on 'accept' button.`,
  image:'docs/screens/start-new2.png' 
});

tipsList.push({
  id:5 ,
  tip:`After accepting he will see 'Open Game' button as below. Click on 'Open Game' to open the chess.`,
  image:'docs/screens/open-game2.png' 
});
tipsList.push({
  id:6 ,
  tip:`If other user accepts your invitation then you will see same 'Open Game' button as below.</br>Click on 'Open Game' to open the chess.`,
  image:'docs/screens/open-game1.png' 
});
tipsList.push({
  id:7 ,
  tip:`After opeing the game you will see Chess board as below.</br>The player who has sent invite can play first.<br>Inviter will get green pices. Who has accepted the invitaion will get red pices.`,
  image:'docs/screens/board.JPG' 
});
tipsList.push({
  id:8 ,
  tip:`Start plaing by clicking on any green piece. After clicking on any piece all valid moves will be shown with blue circles.`,
  image:'docs/screens/play1.png' 
});
tipsList.push({
  id:9 ,
  tip:`At the left top corner you can see players killed pices.It shows pices list with players id.`,
  image:'docs/screens/play2.png' 
});
tipsList.push({
  id:10 ,
  tip:`You can use chat window located at bottom left side of screen to send messages to other player.
  </br>It shows your sent messages in green color and recived messages in white color.`,
  image:'docs/screens/chat0.png' 
});


let tips = {
  currentTip : 0,
  tips : tipsList ,
  hide : () => {
    $.select('#tips').innerHTML = '';
  } ,
  show : (index) => {
    console.log(index);
    let tip =  tipsList[index];
    $.select('#tips').innerHTML = tips.createTip(tip.id , tip.tip , tip.image , index!=0 , index!=tipsList.length-1);
    tips.currentTip = index;
  },
  next : () => {
    tips.show(tips.currentTip+1);
  } ,
  prev : () => {
    tips.show(tips.currentTip-1);
  } ,
  createTip : (id , tip , img , prev , next) => {
    return `
    <div class="popup-card tip center green">
      <div class="close-btn" onClick="this.parentElement.parentElement.removeChild(this.parentElement);"></div>
      <div class="card-head">
        <div class="title"> Tip `+id+`</div>
      </div>
      <div class="card-body">
        <div class="tip">
          `+tip+`
        </div>
        <img src="`+img+`" alt="" width="400px" height="200px"/>
      </div>
      <div class="card-footer">`
        + ( next ? `<button class="right dark" onclick="tips.next()">next</button>` : `<button class="right dark" onclick="tips.hide()">close</button>`)
				+ ( prev ? `<button class="right" onclick="tips.prev()">back</button>` : `` ) + `
      </div>
    </div>`;
  }  
};

function showTips() {
  tips.show(0);
}
