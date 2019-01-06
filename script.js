// Use this URL for API Calls
var root_url = "http://comp426.cs.unc.edu:3001/";


$(document).ready(function () {


  login();
  build_homepage();

});




var cancelflight = function (instance_id) {

  $.ajax(root_url + "instances/" + instance_id,
    {
      type: "PUT",
      dataType: "json",
      xhrFields: { withCredentials: true },
      data: {
        "instance": {
          "is_cancelled": "true"
        }
      },
      success: (message) => {
        console.log(message);
      }, error: () => {
        console.log("Error Cancelling flight");
      }
    });

  document.getElementById('instance-' + instance_id).innerHTML = "CANCELLED";
  document.getElementById('button-' + instance_id).remove();
  $('#div-' + instance_id).append('<div class = "cancel"></div> ');

  alert('Flight cancelled! Thanks for keeping us all safe :) ');

};




var build_flight_interface = function (city_id) {
  let body = $('body');
  body.empty();

  $.ajax({
    async: false,
    url: root_url + 'airports/' + city_id,
    type: 'GET',
    xhrFields: { withCredentials: true },
    success: (response) => {
      body.append('<h1 class = "airport_title">' + response.name + '</h1>');
    },
    error: () => { alert('Error in getting from city'); }
  });
  $(".airport_title").click(function () {
    build_homepage();
  });



  body.append('<div class="flight departures"></div>');
  body.append('<div class="flight arrivals"></div>');
  body.append('<div id = "message">LOADING...</div>');
  let arrival_div = $('.arrivals');
  arrival_div.append('<h2>Arrivals</h2>');
  let other_div = $('<div class="a"></div>');
  other_div.append('<div class = "header flight">Flight</div>');
  other_div.append('<div class = "header from">From</div>');
  other_div.append('<div class = "header depart_time">Departs</div>');
  other_div.append('<div class = "header arrive_time">Arrives</div>');
  other_div.append('<div class = "header status">Status</div>');
  other_div.append('<div class = "header cancel">Cancel</div>');
  arrival_div.append(other_div);

  let departure_div = $('.departures');
  departure_div.append('<h2>Departures</h2>');
  let other_div4 = $('<div class="d"></div>');
  other_div4.append('<div class = "header flight">Flight</div>');
  other_div4.append('<div class = "header from">Destination</div>');
  other_div4.append('<div class = "header depart_time">Departs</div>');
  other_div4.append('<div class = "header arrive_time">Arrives</div>');
  other_div4.append('<div class = "header status">Status</div>');
  other_div4.append('<div class = "header cancel">Cancel</div>');
  departure_div.append(other_div4);

  //get the arrivals
  $.ajax({
    url: root_url + 'flights?filter[arrival_id]=' + city_id,
    type: 'GET',
    xhrFields: { withCredentials: true },
    success: (response) => {
      arrivals = response;
      //console.log(arrivals)
      for (let i = 0; i < arrivals.length; i++) {
        let flightnum = arrivals[i].number;
        $.ajax({
          async: false,
          url: root_url + 'airports/' + arrivals[i].departure_id,
          type: 'GET',
          xhrFields: { withCredentials: true },
          success: (response) => {
            fromname = response.city;
          },
          error: () => { alert('Error in getting from city'); }
        });
        let arrivaltime = arrivals[i].arrives_at.slice(11, 16);
        let departuretime = arrivals[i].departs_at.slice(11, 16);
        $.ajax({
          async: false,
          url: root_url + 'instances?filter[date]=2018-12-11&filter[flight_id]=' + arrivals[i].id,
          type: 'GET',
          xhrFields: { withCredentials: true },
          success: (response) => {
            if (response[0]) {
              if (response[0].is_cancelled) {
                //console.log("CANCELLED")
                status = "CANCELLED";
                instanceid = response[0].id;

              }
              else {
                status = "On Time";
                instanceid = response[0].id;
              }
              //is_cancelled = response[0].is_cancelled
              //console.log(is_cancelled)
            }
            else {
              status = "No Flight Today";
              instanceid = 0;

            }
          },
          error: () => { alert('Error in getting from city'); }
        });
        //console.log(flightnum + fromname + arrivaltime + departuretime + status);
        let other_div2 = $('<div class="a" id = "div-' + instanceid + '"></div>');
        other_div2.append('<div class = "flight">' + flightnum + '</div>');
        other_div2.append('<div class = "from">' + fromname + '</div>');
        other_div2.append('<div class = "depart_time">' + departuretime + '</div>');
        other_div2.append('<div class = "arrive_time">' + arrivaltime + '</div>');
        other_div2.append('<div class = "status" id = "instance-' + instanceid + '">' + status + '</div>');
        if (status == "On Time") {
          other_div2.append('<button class="cancel" id = "button-' + instanceid + '" onclick="cancelflight(' + instanceid + ')"> Cancel </button> ');
        }
        else {
          other_div2.append('<div class = "cancel"></div> ');
        }
        departure_div.append(other_div2);
      }
    },
    error: () => { alert('Error in getting arrivals'); return value; }
  });


  //get the departures
  $.ajax({
    url: root_url + 'flights?filter[departure_id]=' + city_id,
    type: 'GET',
    xhrFields: { withCredentials: true },
    success: (response) => {
      arrivals = response;
      //console.log(arrivals)
      for (let i = 0; i < arrivals.length; i++) {
        let flightnum = arrivals[i].number;
        $.ajax({
          async: false,
          url: root_url + 'airports/' + arrivals[i].arrival_id,
          type: 'GET',
          xhrFields: { withCredentials: true },
          success: (response) => {
            destinationname = response.city;
          },
          error: () => { alert('Error in getting from city'); }
        });
        let arrivaltime = arrivals[i].arrives_at.slice(11, 16);
        let departuretime = arrivals[i].departs_at.slice(11, 16);
        $.ajax({
          async: false,
          url: root_url + 'instances?filter[date]=2018-12-11&filter[flight_id]=' + arrivals[i].id,
          type: 'GET',
          xhrFields: { withCredentials: true },
          success: (response) => {
            if (response[0]) {
              if (response[0].is_cancelled) {
                //console.log("CANCELLED")
                status = "CANCELLED";
                instanceid = response[0].id;
              }
              else {
                status = "On Time";
                instanceid = response[0].id;
              }
              //is_cancelled = response[0].is_cancelled
              //console.log(is_cancelled)
            }
            else {
              status = "No Flight Today";
              instanceid = 0;

            }
          },
          error: () => { alert('Error in getting from city'); }
        });
        //console.log(flightnum + fromname + arrivaltime + departuretime + status);
        let other_div2 = $('<div class="d" id = "div-' + instanceid + '"></div>');
        other_div2.append('<div class = "flight">' + flightnum + '</div>');
        other_div2.append('<div class = "from">' + destinationname + '</div>');
        other_div2.append('<div class = "depart_time">' + departuretime + '</div>');
        other_div2.append('<div class = "arrive_time">' + arrivaltime + '</div>');
        other_div2.append('<div class = "status" id = "instance-' + instanceid + '">' + status + '</div>');
        if (status == "On Time") {
          other_div2.append('<button class="cancel" id = "button-' + instanceid + '" onclick="cancelflight(' + instanceid + ')"> Cancel </button> ');
        }
        else {
          other_div2.append('<div class = "cancel"></div> ');
        }
        arrival_div.append(other_div2);
      }
      document.getElementById('message').innerHTML = "";

    },
    error: () => { alert('error getting arrivals'); return value; }
  });

};

var login = function () {
  let data = {
    user: {
      username: "smh",
      password: "charlotte",
    },
  };
  $.ajax({
    url: 'http://comp426.cs.unc.edu:3001/sessions',
    type: 'POST',
    data: data,
    xhrFields: { withCredentials: true },
    success: function (d, textStatus, jqXHR) {
      console.log("you are logged in")
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 0) {
        alert(
          'Unable to reach server. Make sure you are online. If you are off-campus, make sure you are connected to the VPN.'
        );
      } else if (jqXHR.status === 401) {
        alert(
          'Incorrect username and/or password.'
        );
      } else {
        alert(
          'An unknown error occurred logging in.'
        );
      }
    },
    complete: function (jqXHR, textStatus) {
      //isSubmitting = false;
      //$loginSubmitButton.prop('disabled', false);
    },
  });
};




//SJ - update home page after each slider event
var add_to_page = function (temp, snow, rain) {
  $('.ticketwindow').empty();

  $.ajax({
    url: root_url + '/airports',
    type: 'GET',
    xhrFields: { withCredentials: true },
    success: (response) => {
      cities_array = response;
      for (let i = 0; i < cities_array.length; i++) {
        postweather(response[i].city, response[i].id, temp, snow, rain)
      }
    }
  });
};

//SJ - create the home page
var build_homepage = function () {
  let body = $('body');
  body.empty();
  body.addClass('pg2');
  body.append("<h1>Weather Flight Cancellation Interface</h1>");
  let windowcontainer = $('<div class="window-container"></div>');
  body.append(windowcontainer)
  let search = $('<div class="search"></div>');
  search.append('<p>Max Temperature: <span id="demo">123</span></p>');
  let slidecontainer = $('<div class="slidecontainer"></div');
  slidecontainer.append('<input type="range" min="-32" max="123" value="123" class="slider" id="myRange" onmouseup="temp_release()" oninput="temp_update()">');
  search.append(slidecontainer);
  search.append('<p>Snow:</p>');
  let switchcontainer1 = $('<label class="switch"></label>');
  switchcontainer1.append('<input type="checkbox" id="snow_box" oninput="temp_release()">');
  switchcontainer1.append('<span class="toggleslider round"></span>');
  search.append(switchcontainer1);
  search.append('<p>Rain:</p>');
  let switchcontainer2 = $('<label class="switch"></label>');
  switchcontainer2.append('<input type="checkbox" id="rain_box" oninput="temp_release()">');
  switchcontainer2.append('<span class="toggleslider round"></span>');
  search.append(switchcontainer2);
  windowcontainer.append(search);
  windowcontainer.append('<div class="ticketwindow"></div>');

  var slider = document.getElementById("myRange");
  var snow_slider = document.getElementById("snow_box");
  var rain_slider = document.getElementById("rain_box");
  add_to_page(slider.value, snow_slider.checked, rain_slider.checked);
};

//when the button is clicked, it converts button value to a string
var newpage = function (CityCode) {
  build_flight_interface(CityCode.id);
};



//SJ-when slider is moved, changed page temp value
var temp_update = function () {
  var slider = document.getElementById("myRange");
  var output = document.getElementById("demo");
  output.innerHTML = slider.value;
};
//SJ - when temp slider is released, refresh the airports
var temp_release = function () {
  console.log("BUTTON PUSHED")
  var slider = document.getElementById("myRange");
  var snow_slider = document.getElementById("snow_box");
  var rain_slider = document.getElementById("rain_box");

  body = $('body')
  body.removeClass()


  if (rain_slider.checked){
    body.addClass('raining')
  }
  if (snow_slider.checked){
    body.removeClass();
    body.addClass('snowing')
  }
  if (!snow_slider.checked && !rain_slider.checked){
    body.addClass('sunny')
  }

  add_to_page(slider.value, snow_slider.checked, rain_slider.checked);
};

var postweather = function (city, airport_id, temp, snow, rain) {
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=Imperial&APPID=1f6c7d09a28f1ddccf70c06e2cb75ee4",
    type: "GET",
    dataType: "jsonp",
    success: function (data) {
      var snow_amt = 0
      var rain_amt = 0
      if (data.snow !== undefined) {
        if (data.snow["1h"] !== undefined) {
          snow_amt = snow_amt + data.snow["1h"];
        }
        if (data.snow["3h"] !== undefined) {
          snow_amt = snow_amt + data.snow["3h"];
        }
      }
      if (data.rain !== undefined) {
        if (data.rain["1h"] !== undefined) {
          rain_amt = rain_amt + data.rain["1h"];
        }
        if (data.rain["3h"] !== undefined) {
          rain_amt = rain_amt + data.rain["3h"];
        }
      }
      if (data.main.temp < temp && (snow == Boolean(snow_amt)) && (rain == Boolean(rain_amt))) {
        //console.log(airport_code)
        //$('.ticketwindow').append(data.name + "... temp: " + data.main.temp + ", snow: " + snow_amt + ", rain: " + rain_amt +airport_code+ "<br>")
        //           document.getElementById("weather").innerHTML = "temp in " + data.name + ": " + data.main.temp + ", snow: " + snow_amt + ", rain: " + rain_amt;
        var airport = $('<div class="airport" id=' + airport_id + ' data-temp=' + temp + ' data-snow=' + snow_amt + ' data-rain=' + rain_amt + '> </div>');
        airport.append(' <h2><div class="cityname">' + city + '</div></h2>');
        airport.append('<div class="weather">Temperature: <span class="temp" >' + Math.round(data.main.temp) + '</span>&deg F</div>');
        airport.append('<div class="snow">Last Hour Snow: <span class="snow" >' + snow_amt + '</span>mm</div>');
        airport.append('<div class="rain">Last Hour Rain: <span class="rain" >' + rain_amt + '</span>mm</div>');
        airport.append('<button class="button" onclick="build_flight_interface(' + airport_id + ')">View Flights</button>');
        $('.ticketwindow').append(airport);
      }
    }
  })
};