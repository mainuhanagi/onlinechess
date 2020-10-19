var tabsHeaders = document.querySelectorAll('.tab-header');
tabsHeaders.forEach( (header) => { 
        header.onclick = (e) => { 
        tabsHeaders.forEach((h) => {
            h.classList.remove('active');
            var hVal =h.attributes.header.value;
            try {
                document.querySelector('.tab-body[body="'+hVal+'"]').classList.remove('active');
            }catch(e) { console.log(e);}
        });
        e.target.classList.add('active');
        var hVal = e.target.attributes.header.value;
        try {
            document.querySelector('.tab-body[body="'+hVal+'"]').classList.add('active');
        }catch(e){ console.log(e); }

    }; 
});