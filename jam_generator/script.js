const container = document.getElementById('container');
const inpTanggal = document.getElementById('tanggal');
const btn = document.getElementById('btn');
const pickBulan = document.getElementById('pickBulan');
const inpJumlahGuru = document.getElementById('jumlahGuru');
const inOut = document.getElementById('inOut');
const btnExport = document.getElementById('btnExport');
var getDaysInMonth = function(month,year) {
    // Here January is 1 based
    //Day 0 is the last day in the previous month
   return new Date(year, month, 0).getDate();
  // Here January is 0 based
  // return new Date(year, month+1, 0).getDate();
  };

let dataJamGuru = [];

let times = '';
let TANGGAL = [];
const listBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agusutus','September', 'Oktober', 'November', 'Desember'];
let cetak = 'off';

btn.addEventListener('click', (e) => {
    dataJamGuru = [];
    let tanggalLengkap = inpTanggal.value;
    TANGGAL = tanggalLengkap.split("-");
    buat_absen(TANGGAL[0],TANGGAL[1],inpJumlahGuru.value);
    pickBulan.innerText = listBulan[new Date(tanggalLengkap).getMonth()];
    cetak = 'on';
    if(cetak == 'on') {
        btnExport.classList.add('active');
    }
})

function acak(X,Y=0) {
    let acakXY = Math.floor(Math.random()*X)+Y;
    return acakXY;
}

function buatJam(jam, menit) {
    if (menit > 59) {
        jam = jam + Math.floor(menit/60);
        menit = menit-60;
    }if (jam < 10) {
        jam = '0'+jam;
    }
    if (menit < 10) {
        menit = '0'+menit;
    }
    return jam+':'+menit;
}

function buatJamDenganBatasan(minJam,minMenit, selangWaktu) {
    // minMenit di sini maksudnya menit minimal pertama jam
    return buatJam(minJam,minMenit + acak(selangWaktu+1));
}

function hari (tanggal){
    var d = new Date(tanggal);
  var weekday = new Array(7);
  weekday[0] = "minggu";
  weekday[1] = "senin";
  weekday[2] = "selasa";
  weekday[3] = "rabu";
  weekday[4] = "kamis";
  weekday[5] = "jum'at";
  weekday[6] = "sabtu";

  var n = weekday[d.getDay()];
  return n;
}

function buatJamDenganKententuanTanggal(tanggal) {
    let n = hari(tanggal);
    let timeIn = '';
    let timeOut = '';
    if(n == 'selasa') {
        timeIn = buatJamDenganBatasan(6,30,45);
        timeOut = buatJamDenganBatasan(14,15,15);
    } else if (n=="jum'at"){
        timeIn = buatJamDenganBatasan(6,30,45);
        timeOut = buatJamDenganBatasan(11,15,75);
    } else {
        timeIn = buatJamDenganBatasan(6,30,45);
        timeOut = buatJamDenganBatasan(13,30,30);
    }
    return {"in" : timeIn, "out" : timeOut}
}

function buat_absen(tahun, bulan, jumlah_guru=0) {
    for(let i=0;i < jumlah_guru;i++) {
        dataJamGuru[i] = {
            nama: "Guru "+Number(i+1),
            absen : []
        };
    }
    for (let i = 0; i < dataJamGuru.length; i++) {
        const djg = dataJamGuru[i];
        for (let j=1; j <getDaysInMonth(bulan, tahun)+1;j++) { 
            let tanggal = tahun+'-'+bulan+'-'+j;
            let timess = buatJamDenganKententuanTanggal(tanggal);
           djg.absen[j] = {
               tanggal: tanggal,
               in: timess.in,
               out: timess.out
           }
        }   
    }
    
    
    
    let tables='';
    let tanggalHeader = '<th style="background: #7b9090;" rowspan="2">NAMA</th>';
    let inOutHeader = '';
    for(let k = 1; k <getDaysInMonth(bulan, tahun)+1;k++) {
        if (hari(tahun+'-'+bulan+'-'+k) == 'minggu') {
            tanggalHeader += `
                <th colspan="2" style="background: #ef6161;">`+tahun+`-`+bulan+`-`+k+`</th>
            `;
            inOutHeader += `
                <th style="background: #ef6161;top:17px;">IN</th>
                <th style="background: #ef6161;top:17px;">OUT</th>
            `
        } else {
            tanggalHeader += `
                <th colspan="2">`+tahun+`-`+bulan+`-`+k+`</th>
            `;
            inOutHeader += `
                <th style="background: #a3ff39;top:17px;">IN</th>
                <th style="background: #ffeb3b;top:17px;">OUT</th>
            `
        }
    }
    for (let i = 0; i < dataJamGuru.length; i++) {
        const dtj = dataJamGuru[i];
        let jam = '';
        for (let j = 1; j < dtj.absen.length; j++) {
            const absen = dtj.absen[j];
            if (hari(absen.tanggal) == 'minggu') {
                jam += `
                    <td style="background: #f5a2a2;">`+absen.in+`</td>
                    <td style="background: #f5a2a2;">`+absen.out+`</td>
                `;
            } else {
                jam += `
                    <td style="background: #a3ff39;">`+absen.in+`</td>
                    <td style="background: #ffeb3b;">`+absen.out+`</td>
                `;
            }
        }
        tables += `
        <tr>
            <td style="background: #c4dada;">`+dtj.nama+`</td>`+jam+`
        </tr>
        `;
    }
    
    let table = document.getElementById('dataTable');
    let headtable = document.getElementById('headTable');
    headtable.innerHTML = tanggalHeader;
    table.innerHTML = tables;
    inOut.innerHTML = inOutHeader;
}


function fnExcelReport()
{
    var tab_text="<table border='2px'><tr bgcolor='#87AFC6'>";
    var textRange; var j=0;
    tab = document.getElementById('tableData'); // id of table

    for(j = 0 ; j < tab.rows.length ; j++) 
    {     
        tab_text=tab_text+tab.rows[j].innerHTML+"</tr>";
        //tab_text=tab_text+"</tr>";
    }

    tab_text=tab_text+"</table>";
    tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
    tab_text= tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
    tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE "); 

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
    {
        txtArea1.document.open("txt/html","replace");
        txtArea1.document.write(tab_text);
        txtArea1.document.close();
        txtArea1.focus(); 
        sa=txtArea1.document.execCommand("SaveAs",true,"Say Thanks to Sumit.xls");
    }  
    else                 //other browser not tested on IE 11
        sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));  

    return (sa);
}
