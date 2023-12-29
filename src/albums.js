$(document).ready(function () {
  // $("#statBox").hide();
  // $(".tabArea").hide();
  $("#spinnerModal").modal("show");
  setTimeout(() => {
    $("#spinnerModal").modal("hide");
  }, 5000);
  const path = $(location).attr("pathname");
  const screenWidth = screen.width;
  // alert(screenWidth);

  //check auto bot initiate backup else show albumbs
  path === "/dbupdateservice.php"
    ? (new UpdateData(), $("#spinnerModal").modal("hide"))
    : new LoadMovies().checkDatabaseAPI();

  // // new Mailer(150, 500);
  // screenWidth < 700
  //   ? $(".tabNav").html(`
  //       <div class="nav nav-tabs fixed-top bg-dark mt-5 nav-fill justify-content-center pt-3 ps-2 pe-2" id="nav-tab" style="font-size: 9px;" role="tablist">
  //     	<button class="nav-link" id="nav-english-tab" data-bs-toggle="tab" data-bs-target="#nav-english" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">English</button>
  // 			<button class="nav-link" id="nav-tamil-tab" data-bs-toggle="tab" data-bs-target="#nav-tamil" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">தமிழ்</button>
  // 			<button class="nav-link" id="nav-telugu-tab" data-bs-toggle="tab" data-bs-target="#nav-telugu" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">తెలుగు</button>
  // 			<button class="nav-link" id="nav-hindi-tab" data-bs-toggle="tab" data-bs-target="#nav-hindi" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">हिंदी</button>
  //       </div>'
  //     `)
  //   : "";

  $("#dbupdateCloud").on("click", function () {
    new LoadMovies().albumsDBupdate();
  });
  // clickers for filer
  $("#nav-english-tab").on("click", function () {
    new LoadMovies().pageUpdateTrigger("Eng");
  });
  $("#nav-tamil-tab").on("click", function () {
    new LoadMovies().pageUpdateTrigger("Tam");
  });
  $("#nav-telugu-tab").on("click", function () {
    new LoadMovies().pageUpdateTrigger("Tel");
  });
  $("#nav-hindi-tab").on("click", function () {
    new LoadMovies().pageUpdateTrigger("Hin");
  });
  $("#nav-malayalam-tab").on("click", function () {
    new LoadMovies().pageUpdateTrigger("Mal");
  });
  $("#nav-kannada-tab").on("click", function () {
    new LoadMovies().pageUpdateTrigger("Kan");
  });
});

$(window).width() < 960 &&
  ($("#nav-malayalam-tab").hide(),
  $("#nav-tamil-tab").hide(),
  $("#nav-hindi-tab").hide(),
  $("#nav-kannada-tab").hide());

//retrieve stored json file on server and store as window object that can access faster later requests
class LoadMovies {
  constructor() {}

  // update fileusing this function
  checkDatabaseAPI = async () => {
    try {
      // const response = await fetch(
      //   window.location.href + "/src/showcaselocal.json"
      // );
      const url = "https://sudheerneo.github.io/json_test_api/";
      const response = await fetch(url + "trendingMovies.json");
      var data = await response.json();

      var tel = data.filter((item) => item.title.includes("Tel"));
      var eng = data.filter((item) => item.title.includes("Eng"));
      var tam = data.filter((item) => item.title.includes("Tam"));
      var hin = data.filter((item) => item.title.includes("Hin"));
      var mal = data.filter((item) => item.title.includes("Mal"));
      var kan = data.filter((item) => item.title.includes("Kan"));

      tel = tel.map((prevData, index) => ({ ...prevData, id: index }));
      eng = eng.map((prevData, index) => ({ ...prevData, id: index }));
      tam = tam.map((prevData, index) => ({ ...prevData, id: index }));
      hin = hin.map((prevData, index) => ({ ...prevData, id: index }));
      mal = mal.map((prevData, index) => ({ ...prevData, id: index }));
      kan = kan.map((prevData, index) => ({ ...prevData, id: index }));
      data = data.map((prevData, index) => ({ ...prevData, id: index }));

      const albums = {
        all: data,
        tel: tel,
        eng: eng,
        tam: tam,
        hin: hin,
        mal: mal,
        kan: kan,
      };

      try {
        if ($(window).width() > 960) {
          window.localStorage.clear();
          window.localStorage.setItem("Tel", JSON.stringify(tel.slice(0, 200)));
          window.localStorage.setItem("Eng", JSON.stringify(eng.slice(0, 100)));
          window.localStorage.setItem("Tam", JSON.stringify(tam.slice(0, 100)));
          window.localStorage.setItem("Hin", JSON.stringify(hin.slice(0, 100)));
          window.localStorage.setItem("Mal", JSON.stringify(mal.slice(0, 100)));
          window.localStorage.setItem("Kan", JSON.stringify(kan.slice(0, 100)));
        } else {
          window.localStorage.clear();
          window.localStorage.setItem("Tel", JSON.stringify(tel.slice(0, 200)));
          window.localStorage.setItem("Eng", JSON.stringify(eng.slice(0, 100)));
        }
      } catch (error) {
        console.error("Error saving data to localStorage:", error);
      }

      // window.localStorage.setItem("albumData", JSON.stringify(data));
      // console.log(JSON.parse(window.localStorage.getItem("albumData")));
      this.pageUpdateTrigger("Tel");
      // show toast
      $(".toast-body").text(
        `Db Date :  ${new Date(data[0].updatedOn).toLocaleDateString()}. ${
          data.length
        } movies pulled`
      );
      $(".navbar-nav li:nth-child(3) a").text(
        `Db Version - ${new Date(data[0].updatedOn)
          .toLocaleDateString()
          .replace(/\//g, ":")} `
      );
      $(".navbar-nav li:nth-child(1) a").hide();
      $(".navbar-nav li:nth-child(2) a").hide();

      const toast = new bootstrap.Toast($("#liveToast"));
      toast.show(); //toast end

      //warning
      // Create a modal using jQuery
      var modalContent = `
                    <div class="modal fade" id="warning" tabindex="-1" aria-labelledby="exampleModalLabel" data-bs-backdrop="static" data-bs-keyboard="false">
                    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" >
                        <div class="modal-content">
                        <div class="modal-header bg-danger">
                            <h5 class="modal-title" id="exampleModalLabel">Disclaimer</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body bg-danger">
                            <p>This script is purely for educational purposes and is intended solely for testing and learning. It should not be used for any commercial or real-world applications. The content provided is fictional and not intended to represent any real product, service, or entity. Use this script responsibly and in compliance with all applicable laws and regulations. The author and contributors are not responsible for any misuse or consequences arising from the use of this script.</p>
                        </div>
                        <div class="modal-footer bg-danger">
                            <button type="button" class="btn btn-success" data-bs-dismiss="modal">accept</button>
                        </div>
                        </div>
                    </div>
                    </div>
                    `;
      $("<style>")
        .prop("type", "text/css")
        .html(`.modal { backdrop-filter: blur(15px); }`)
        .appendTo("head");

      // Append the modal to the body after a delay of 5000 milliseconds (5 seconds)
      setTimeout(function () {
        $("body").append(modalContent);

        // Show the modal when the page loads
        $("#warning").modal("show");
      }, 7000);
    } catch (err) {
      console.log(err);
    }
  };

  pageUpdateTrigger = (lang) => {
    const movies = JSON.parse(window.localStorage.getItem(lang));
    const rowItems = parseInt($(window).width() / 250);
    const colItems = parseInt($(window).height() / 390);
    const moviesOnPage = $(window).width() > 960 ? rowItems * colItems : 10; // for mobile show 10 per page
    const totalPages = Math.ceil(movies.length / moviesOnPage);

    const generatePagination = (currentPage) => {
      const maxVisiblePages = 5;
      const halfVisible = Math.floor(maxVisiblePages / 2);

      let startPage = Math.max(1, currentPage - halfVisible);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      renderPagination;
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      let paginationHTML = `<li class="page-item ${
        // currentPage === 1 ? "disabled" : ""
        "disabled"
      }">
        <a class="page-link" href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>`;

      for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<li class="page-item ${
          i === currentPage ? "active" : ""
        }">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>`;
      }
      renderPagination;

      paginationHTML += `<li class="page-item ${
        // currentPage === totalPages ? "disabled" : ""
        "disabled"
      }">
          <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
      </li>`;

      return paginationHTML;
    };

    const updatePagination = (currentPage) => {
      const paginationHTML = generatePagination(currentPage);
      $("#paginationMaster ul").html(paginationHTML);
    };

    const loadPageData = (page) => {
      const startIdx = (page - 1) * moviesOnPage;
      const endIdx = startIdx + moviesOnPage;
      const data = movies.slice(startIdx, endIdx);

      // Assuming you have a reference to your LoadMovies instance
      const loadMoviesInstance = new LoadMovies();
      loadMoviesInstance.pageUpdate(lang, data);
    };

    const renderPagination = (currentPage) => {
      const paginationHTML = generatePagination(currentPage);
      $("#paginationMaster").html(`
        <nav aria-label="Page navigation example">
          <ul class="pagination justify-content-center align-items-center">
            ${paginationHTML}
          </ul>
        </nav>
      `);
    };

    // Load initial data for the first page
    loadPageData(1);

    // Render initial pagination
    renderPagination(1);

    // Event listener for pagination links
    $("#paginationMaster").on("click", ".page-link", (e) => {
      e.preventDefault();
      const clickedPage = $(e.currentTarget).data("page");

      // Update the pagination based on the clicked page
      updatePagination(clickedPage);

      // Load data for the clicked page
      loadPageData(clickedPage);
      const scrollDiv = document.getElementById("paginationMaster").offsetTop;
      window.scrollTo({ top: scrollDiv - 70, behavior: "smooth" });
    });
  };

  pageUpdate = (filter, data) => {
    $(".tabArea").show();
    $("#" + filter).html("");

    const colorsArray = [
      "rgba(0,191,255,1.0)",
      "rgba(0,100,0,1.0)",
      "rgba(128,0,128,1.0)",
      "rgba(0,0,128,1.0)",
      "rgba(255,0,0,1.0)",
      "rgba(255,165,0,1.0)",
      "rgba(0,0,0,1.0)",
    ];

    let tracker = 0;
    const randomColorGenerator = () => {
      const value = colorsArray[tracker];
      tracker = (tracker + 1) % colorsArray.length;
      return value;
    };

    $.each(data, async (index, val) => {
      const ftitle =
        (await val.title) != null
          ? val.title
              .replace(".mkv", "")
              .replace(" - ESub", "")
              .replace("- HQ Clean Aud", "")
              .replace("HQ PreDVD", "")
              .replace("- HQ HDRip ", "")
          : "loading";
      const year =
        (await ftitle.match(/\(([^)]+)\)/)[1]) != null
          ? ftitle.match(/\(([^)]+)\)/)[1]
          : "year";
      const title = await val.title
        .toString()
        .substring(0, ftitle.indexOf("("));

      const poster =
        (await val.thumbnail) != "default"
          ? val.thumbnail[0]
          : "images/gradient.jpg";

      let randomColor = randomColorGenerator();

      const albumName = (name) => {
        if (name.length > 20) {
          return name.slice(0, 20) + "...";
        } else {
          return name.slice(0, 20);
        }
      };

      const albumFName = (name) => {
        if (name.length > 60) {
          return name.slice(0, 60) + "...";
        } else {
          return name.slice(0, 60);
        }
      };

      const appender = async (movie, filter) => {
        $("#" + movie.filter).append(`
            <div class="col-2 col-md-4 col-sm-6 col-xs-6 container_foto">
            <a href="javascript:new LoadMovies().downloadAlert('${filter}', ${
          movie.id
        })">

                <div class="ver_mas">
                  <svg id="click" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" style="margin-top: 18px" class="bi bi-eye-fill text-center" viewBox="0 0 16 16">
                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                  </svg>
                </div>
              </a>
              <article style="background-image: linear-gradient(rgba(10,0,0,0.5), ${
                movie.randomColor
              })" class="text-left">
                <h2 class="w-100 " style="font-size: 17px;">${albumName(
                  movie.title
                )}<br>
                  <span class="light">${movie.year}</span>
                </h2>
                <h4 class="w-100" style="font-size: 12px;">${albumFName(
                  movie.ftitle
                )}</h4>
              </article>
              <img class="imgthums lazyload" src="${
                movie.poster
              }" data-original="${
          movie.poster
        }" referrerpolicy="no-referrer" alt="Image"  onerror="this.src='/images/gradient.jpg';"
        >
            </div>
                `);
      };
      const passedData = {
        randomColor: randomColor,
        title: title,
        year: year,
        ftitle: ftitle,
        poster: poster,
        filter: filter,
        index: index,
        id: val.id,
      };

      appender(passedData, filter);
    }); //end of each loops
  };

  downloadFileInTab(title, url) {
    // window.open(url, "_blank");
    location.href = url;
  }

  downloadFile(title, url) {
    console.log("donwload file called");
    console.log(`title: ${title}\n url : ${url}`);
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error: Failed to download file");
        }

        // Extract content type and content disposition from response headers
        const contentType = response.headers.get("Content-Type") || "";
        const contentDisposition =
          response.headers.get("Content-Disposition") || "";

        // Set content type and content disposition headers
        if (contentType) {
          document.contentType = contentType;
        }
        if (contentDisposition) {
          document.contentDisposition = contentDisposition;
        }

        // Trigger file download
        return response.blob();
      })
      .then((blob) => {
        // Create a blob URL for the blob
        const blobUrl = URL.createObjectURL(blob);

        // Create a temporary link element
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = title;

        // Trigger the click event on the link to start the download
        document.body.appendChild(link);
        link.click();

        // Remove the link from the document
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  // showing modal to download content
  downloadAlert = (lang, curLink) => {
    const data = JSON.parse(window.localStorage.getItem(lang));
    const movie = data[curLink];

    $(".carousel-inner").html("");
    $(".carousel-indicators").html("");
    $(".carousel").attr("data-bs-ride", "false");
    $(".carousel").carousel("dispose");

    movie.thumbnail != "default"
      ? movie.thumbnail.map((image, index) => {
          const actveCheck = index === 0 ? "active" : "";
          $(".carousel-inner").append(` 
                    <div class="carousel-item ${actveCheck}"> 
                    <img src="${image}" class="d-block w-100" alt="image${index}"  onerror="this.src='/images/defbg.png';">
                    </div>
                    `);
          $(".carousel-indicators").append(`
                    <button type="button" data-bs-target="#carExInd" data-bs-slide-to="${index}" class="${actveCheck}" aria-current="true" aria-label="Slide ${(index += 1)}"></button>
                    `);
        })
      : ($(".carousel-inner").append(` 
                <div class="carousel-item active"> 
                <img src="${window.location.href}/images/defbg.png" class="d-block w-100" alt="image 1"  onerror="this.src='/images/defbg.png';">
                </div>
                `),
        $(".carousel-indicators").append(`
                <button type="button" data-bs-target="#carExInd" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                `));
    // reset Accordian
    $(".accordion").html("");

    // adding Download links with array in movie
    movie.torrlinks.map((mov, index) => {
      const movieName = mov.torrName;
      const title = movieName.toString().substring(0, movieName.indexOf("("));
      const yearMatch = movieName.match(/\(([^)]+)\)/);
      const year = yearMatch != null ? yearMatch[1] : "year";
      $("#movieTitle").text(title + " - " + year);
      const movieTorent = mov.downlink;
      const magnetLink = movie.magLinks[index];

      const titleArray = movieName
        .replace("ESub.torrent", "")
        .replace("ESub.mkv.torrent", "")
        .slice(0, 60)
        .substring(movieName.indexOf(")") + 1)
        .split(" - ");

      const tagColors = [
        "secondary",
        "primary",
        "success",
        "danger",
        "warning",
        "info",
        "secondary",
        "dark",
      ];

      const titleFinaler = titleArray.map((val, index) =>
        index == 0
          ? val
          : '<span class="badge text-bg-' +
            tagColors[index] +
            ' p-2" style=" font-size: 8px; margin: 2px" >' +
            val +
            "</span>"
      );

      // writing accordian
      $(".accordion").append(`
                <div class="accordion-item ">
                    <h2 class="accordion-header" id="flush-heading${index}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse${index}" style="display: block; justify-content: center align-items: center" aria-expanded="false" aria-controls="flush-collapse${index}">
                            ${titleFinaler.join(" ")}
                    </button>
                    </h2>
                    <div id="flush-collapse${index}" class="accordion-collapse collapse" aria-labelledby="flush-heading${index}" data-bs-parent="#downloadAccordian">
                    <div class="accordion-body" style="font-size: 16px">
                        <div class="row align-items-start">
                        <div class="col">
                            <a href="${magnetLink}" style="text-decoration: none">
                            <img src=${
                              window.location.href + "images/magnet.png"
                            } height="32" width="32" />
                            <p> Magnet</p>
                            </a>
                        </div>
                        <div class="col">
                        <a href="javascript:void(0);" onclick="
                            const loadMoviesInstance = new LoadMovies();
                            loadMoviesInstance.downloadFileInTab(
                            decodeURIComponent('${encodeURIComponent(
                              movieName
                            )}'),
                            decodeURIComponent('${encodeURIComponent(
                              movieTorent
                            )}')
                        );
                    " style="text-decoration: none">
                            <img src=${
                              window.location.href + "images/torrent.png"
                            } height="32" width="32" />
                            <p> Torrent</p>
                            </a>
                            </div>              
                        </div>
                    </div>
                </div>
            `);
    });

    //setting title
    $("#downloadViewer").modal("show"); //show download Dialougue
    $(".carousel").attr("data-bs-ride", "caousel"); // run carousal
    $(".carousel").carousel("cycle");
  }; // end of dwonload alert
} //class end line

class UpdateData {
  constructor() {
    this.albumsDBupdate();
  }

  //updates data to movie Database preparing from index page source
  albumsDBupdate = async () => {
    $(".tabArea").hide();
    $("#statBox").show();
    $("#progms").text(""), $("#work").html("");
    this.progressBar("<b>Preparing.....</b>");
    try {
      const response = await fetch("/src/model.php");
      const data = await response.text();
      $("#total").text(5); //progress progressBar
      $("#count").text(5);
      this.progressBar("Parsing web page"); //display text progress
      $("#count").text(0);
      this.processUpdate(data);
    } catch {
      (err) => console.log(err);
    }
  };

  //process html data and filter and retrn links
  processUpdate = async (res) => {
    var links = [];
    const anchorTags = $(res).find(
      "div.ipsWidget_inner.ipsPad.ipsType_richText  a"
    );
    $("#total").text(anchorTags.length); //progress bar
    var x = 0;
    var y = 0;
    var indexOfLinks = 0;
    anchorTags.each((index, value) => {
      const link = value.href;
      //progressbar
      $("#count").text(y++);
      this.progressBar(
        "All anchorTags " + anchorTags.length + ". working tags " + x++
      );
      if (link && link.includes("forums") == true) {
        links.push(link);
        indexOfLinks++;
      }
    });
    $("#count").text(0);

    // remove repeated or duplicate entries in the links array
    const removeDuplicates = async (links) => {
      var unique = [];
      for (let i = 0; i < links.length; i++) {
        if (unique.indexOf(links[i]) === -1) {
          unique.push(links[i]);
        }
        $("#count").text(100);
        this.progressBar("Fixing bad links wait...");
      }
      return unique;
    };

    const finalUrls = await removeDuplicates(links);
    await this.linkPusher(finalUrls);
  };

  //making api of each working link and remove bad links
  linkPusher = async (links) => {
    var goodLinksBasket = [];
    var badLinksBasket = [];
    var totalLinks = links.length;
    $("#total").text(totalLinks); //progress bar
    var counting = 0;
    // get each Movie data
    const getMovies = async (refdata) => {
      try {
        const response = await fetch("src/getmovies.php", {
          method: "post",
          body: JSON.stringify(refdata),
        });

        if (!response.ok) {
          // throw new Error(`HTTP error! status: ${response.status}`);
          return { NotOkHttpError: response.status };
        }

        const res = await response.json();
        return res;
      } catch (err) {
        // console.error(err);
        return { CatchedHttpError: err };
      }
    };
    //running throuch each link
    $.each(links, async (index, value) => {
      var data = await getMovies(value);
      if (data.torrlinks === null || typeof data.torrlinks === "undefined") {
        badLinksBasket.push(data);
        counting += 1;
      } else {
        goodLinksBasket.push(data);
        counting += 1;
      } //end else

      //progressbar
      $("#count").text(counting);
      this.progressBar(
        `Grabbed <b>${totalLinks}</b> links. procecced links <b>${counting}</br> ${
          typeof data.title === "undefined" ? "checking..." : data.title
        }`
      );

      totalLinks === counting
        ? (this.dbupdateonLocalitSelf(goodLinksBasket, totalLinks),
          $("#statBox").hide())
        : null;
    });
  };

  //make a file  to local json file for api
  dbupdateonLocalitSelf = (data, workedLinks) => {
    $("#statBox").show();
    $("#work").html("");
    try {
      const albums = data;
      fetch("/src/makeJson.php", {
        method: "post",
        body: JSON.stringify(albums),
      }),
        $("#progms").text(
          `Data updating task successfully completed. Latest ${albums.length} links gathered out of ${workedLinks}.`
        );
      new Mailer(data.length, workedLinks);
      // show toast
      $(".toast-body").text(
        `Report sent to mail. ${data.length} movies data gathered successfully`
      );
      const toast = new bootstrap.Toast($("#liveToast"));
      toast.show(); //toast end
    } catch {
      (err) => console.log(err);
    }
  };

  // show Progress Bar
  progressBar = (msgtext) => {
    var count = Number(document.getElementById("count").innerHTML); //set this on page load in a hidden field after an ajax call
    var total = document.getElementById("total").innerHTML; //set this on initial page load
    var pcg = Math.floor((count / total) * 100);
    $(".progress-bar").text(pcg + "%");
    $("#progmsg").html('<p class="text-center">' + msgtext + "</p>");
    $(".progress-bar").eq(0).attr("aria-valuenow", pcg);
    $(".progress-bar")
      .eq(0)
      .css("width", pcg + "%");
  };
} //class end line

// send mail while task finish successfully
class Mailer {
  constructor(data, failedLinks) {
    this.data = data;
    this.failedLinks = failedLinks;
    this.send();
  }

  async send() {
    console.log("sending mail");
    const template = await fetch(
      window.location.origin + "/mail/template.html"
    );
    const mail = await template.text();

    const parser = new DOMParser();
    const mailCode = parser.parseFromString(mail, "text/html");

    //debugging
    // mailCode.querySelector("#p2").textContent = failedLinks;
    // mailCode.querySelector("#p1").innerHTML = data;
    // mailCode.querySelector("#p3").textContent = " ";
    mailCode.querySelector(
      "#heading"
    ).innerHTML = `<strong>Hi, I'm your Personal Assistant,<br />Notifying you something important!...</strong >`;

    mailCode.querySelector(
      "#p1"
    ).textContent = `I have found ${this.failedLinks} latest links for my work`;

    mailCode.querySelector(
      "#p2"
    ).innerHTML = `Successfully uploaded <strong>${this.data}</strong> brand new working links after my hardwork with all downloading links in JSON API. Remain links has some issues. so, I've decided to remove bad links using my filter mechanism. Thanks for your code anyway.`;

    mailCode.querySelector(
      "#p3"
    ).textContent = `Enjoy your time, I just uploaded working links successfully. Happy coding. I'll try my best to help your site up and running, If i found any new data I will update for sure. Your code works flawlesly ðŸ˜Š`;

    mailCode.querySelector("#date").textContent = new Date();
    const finalMail = mailCode.documentElement.outerHTML;

    const mailObj = {
      subject: `Data updated ${this.data}/${
        this.failedLinks
      } using Bot on ${new Date()}`,
      bodyHtml: finalMail,
      bodyPlain: `Hi, I've found ${this.data} working API links out of ${
        this.failedLinks
      } on ${new Date()}. Thanks for having me Sudheer. Regards, Tech Bot`,
    };
    try {
      const response = await fetch(window.location.origin + "/mail/mail.php", {
        method: "post",
        body: JSON.stringify(mailObj),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const res = await response.json();
      //  looking for errors;
    } catch (err) {
      // console.log(err);
    }
  }
} //class end

// confirm update database using pass key
const validate = () => {
  $(".navbar-collapse").collapse("hide");
  const key = prompt("Enter PassCode to confirm Update Progress");
  key === "9640"
    ? // ? new UpdateData()
      alert("source updated to node backend")
    : alert("You are fired. I dont trust you anymore. Getout");
};
