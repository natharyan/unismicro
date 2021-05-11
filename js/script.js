
function give(max,patentn){
  console.log(max);
  console.log(patentn)
  var blob = new Blob([fasta.value], { type: "text/plain;charset=utf-8" });
  saveAs(blob, "dynamic.txt");
  var hyper = "http://patft.uspto.gov/netacgi/nph-Parser?Sect1=PTO1&Sect2=HITOFF&d=PALL&p=1&u=%2Fnetahtml%2FPTO%2Fsrchnum.htm&r=1&f=G&l=50&s1=" + patentn + ".PN.&OS=PN/" + patentn + "&RS=PN/" + patentn;
  
  patent.innerHTML = "<a href='" + hyper + "' target='_blank'>USPTO Patent Online</a>";
}

function getId(){
  $.ajax({ url: "https://localhost:44365/api/FastaSequence", dataType: `text` }).done(parseFasta);
}
function parseFasta(request) {
  var fasta = document.getElementById("fasta");
  var image = document.getElementById("image");
  var percentageIdentity = document.getElementById("percentageIdentity");
  var recommendation = document.getElementById("recommend");
  var patent = document.getElementById("patent");
 
  var apiPerc;
  var max = 0;
  var urltoparse =  "https://blast.ncbi.nlm.nih.gov/blast/Blast.cgi?CMD=Get&FORMAT_TYPE=Text&RID=YVWXY84701R"; /* + request;*/
  var patentmax = "";

  $.ajax({ url: urltoparse, dataType: `text` }).done(successFunction);
  function successFunction(data) {
    
    data = data.trim().match(/[^\r\n]+/g);
    const end = data.indexOf("ALIGNMENTS") - 1;
    for (let index = 29; index < end; index++) {
      var element = data[index];
      var patentin;
      element = element.trim().match(" ");
      element = element['input'];
      apiPerc = element.split(" ");
      patentin = apiPerc[6];
      apiPerc = parseInt(apiPerc[apiPerc.length - 1].replace("%",""));
      if(apiPerc>max){
        max = apiPerc;
        patentmax = patentin;
      }
    }
    return give(max,patentmax);
  }
  

  if (apiPerc == 100) {
    /*no chance*/
    image.src = "http://altruistic.netlify.app/img/crying.svg";
  } else if (apiPerc < 100 && apiPerc > 90) {
    /*Highly Likely*/
    image.src = "http://altruistic.netlify.app/img/crying.svg";
    recommend
  } else if (apiPerc < 90 && apiPerc > 70) {
    /*Likely*/
    image.src = "http://altruistic.netlify.app/img/sad.svg";
  } else if (apiPerc < 70 && apiPerc > 50) {
    /*Unlikely*/
    image.src = "http://altruistic.netlify.app/img/cross.svg";
  } else if (apiPerc < 50 && apiPerc > 30) {
    /*Highly unlikely*/
    image.src = "http://altruistic.netlify.app/img/thumbsup.svg";
  } else if (apiPerc < 30) {
    /*Most Likely Not*/
    image.src = "http://altruistic.netlify.app/img/happy.svg";
  } else {
    return 0;
  }
  document.getElementById("result").style.visibility = "visible";
  percentageIdentity.innerHTML = apiPerc + " percent (" + apiPerc + "%)";
}

var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}