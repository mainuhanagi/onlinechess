var self = $.select('input[name="self"]');
var opponant = $.select('input[name="opponant"]');

profLister.push( (res) => { 
    self.value = res.username;
});


opponant.oninput = (e) => {
    if(opponant.value.length == 0)
        $.select('#send').classList.add('disabled');
    if(opponant.value.length > 0)
        $.select('#send').classList.remove('disabled');
};

function sendRequest() {
    $.select('.status .open-btn').innerHTML = '';
    $.select('.spinner').classList.remove('hide');
    $.select('.spinner').classList.add('show');
    let invite = { to:opponant.value , gameId : playerPrfo.games[0].id};
    console.log('invite:'+JSON.stringify(invite));

    axios.post('/invite' , invite ).then( (res) => {
        let invt = res.data.invite;
        console.log('invite details : '+JSON.stringify(invt));
        $.select('.spinner').classList.remove('show');
        $.select('.spinner').classList.add('hide');

        if(res.data.status == 'rejected'){
            Swal.fire( '' , opponant.value + ' rejected your request !');
            return ;
        }

        let html = `<label class="btn warn" onclick='openGame("`+ invt.gameId +`")'> Open Game </label>`;
        $.select('.status .open-btn').innerHTML = html;
    }).catch( (err) => {
        console.log('error : '+err);
        $.select('.spinner').classList.remove('show');
        $.select('.spinner').classList.add('hide');
    });    
}

             
function openGame(id) {
    window.open('start?gameId='+id,'_blank');
}