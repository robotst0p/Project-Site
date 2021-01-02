var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var body_div = document.getElementById('canvas-container');
var max_particle_input = document.getElementById('max-particle-input');
var line_distance_input = document.getElementById('line-distance-input');
var gol_form = document.getElementById('gol_form');
var x_coord = document.getElementById('xcoord');
var y_coord = document.getElementById('ycoord');
var submit_btn = document.getElementById('btnsubmit');

var particle_array = [];
var rand_range = [-1,0,1];
var second_range = [-1,1];

var magnet_flag = false;
var active_session = false;

var mouse_x = 0;
var mouse_y = 0;
var rand_x = 0;
var rand_y = 0;
var y_dir = 0;
var x_dir = 0;

var grav_radius = 0;
var grav_force = 0;
var mass = 0;

var rand_color = 0;

var speed = 0;

var win_height = window.innerHeight;
var win_width = window.innerWidth;

var max_particle = 80;
var new_particle = 0;
var current_particle = 0;

var line_distance = 0;
var line_distance_threshold = 50;

const color_array = ["black", "red", "green", "blue", "purple", "yellow", "orange"];

//particle class constructors
class Particle {

    constructor(x_pos, y_pos, init_x_dir, init_y_dir, mass) {
        this.x_pos = x_pos;
        this.y_pos = y_pos;

        this.init_x_dir = init_x_dir;
        this.init_y_dir = init_y_dir;

        this.mass = mass;
    }
}

//detecting when a user is trying to magnetize particles
canvas.onmousedown = magnet_click;
canvas.onmouseup = magnet_unclick;

//tracks the users mouse position on screen
canvas.addEventListener("mousemove", function(event) {
    mouse_x = getMousePos(event).x;
    mouse_y = getMousePos(event).y;
})

//flags to indicate user is magnetizing 
function magnet_click(event) {
    magnet_flag = true;
    mouse_x = getMousePos(event).x;
    mouse_y = getMousePos(event).y;
}

//unmagnetizing when the user stops clicking
function magnet_unclick(event) {
    magnet_flag = false;
}

//calculates the users mouse position within the canvas 
function getMousePos(event) {
    var rect = canvas.getBoundingClientRect(), 
        scaleX = canvas.width / rect.width,    
        scaleY = canvas.height / rect.height;  
    
    return {
        x: (event.clientX - rect.left) * scaleX,   
        y: (event.clientY - rect.top) * scaleY    
    }
}

//onload, the particles will generate and the code will detect whether or not it is the users first time on the site for particle data collection
window.addEventListener('load', function() {
    window.requestAnimationFrame(animate);

    particle_generator(0, max_particle);

    checkFirstVisit(particle_array);
})

//event listener to detect user changes in number of particles desired on screen
max_particle_input.addEventListener('change', function () {
    max_particle = max_particle_input.value;
    console.log("change");
    particle_array = [];
})

//event listener to detect user changes to the desired distance between particles for line drawing
line_distance_input.addEventListener('change', function() {
    line_distance_threshold = line_distance_input.value;
})

//function responsible for drawing all frames of the animation on the canvas
function animate() {

    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "black";
    ctx.save();

    canvas.width = win_width;
    canvas.height = win_height;

    //this if test is used to account for user changes in number of particles between animation frames
    if (particle_array.length < max_particle) {
        particle_generator(particle_array.length, max_particle);
    }
   
    //when the magnet flag is true, a blue arc is drawn at the user position and the speed of particles traveling is lowered
    switch (magnet_flag) {
        case true:
            var grav_constant = 2;
            ctx.beginPath();
            ctx.strokeStyle = "blue";
            ctx.arc(mouse_x,mouse_y, 12, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.stroke();

            speed = (1/500);

            particle_mover(speed);
            break;
        
        //when the user is not magnetizing, the speed of the traveling particles is higher
        case false:
            speed = 1;
           
            particle_mover(speed);
            break;
    }
    window.requestAnimationFrame(animate);
}

//function responsible for generating the particles
function particle_generator(start, end) {
    for (var i = start; i <= end; i++) {
        //randomizing the x and y positions of the particles and the directions the particles will be traveling
        rand_x = Math.floor(Math.random() * win_width);
        rand_y = Math.floor(Math.random() * win_height);
        x_dir = rand_range[Math.floor(Math.random() * 2)];
        y_dir = rand_range[Math.floor(Math.random() * 2)];

        //we don't want any stationary particles, so if the x velocity is 0 this code makes sure the y velocity wont be zero as well
        switch (x_dir) {
            case 0:
                y_dir = second_range[Math.floor(Math.random() * 2)];
                break;
        }
        switch (y_dir) {
            case 0:
                x_dir = second_range[Math.floor(Math.random() * 2)];
                break;
        }

        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.arc(rand_x, rand_y, 2, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.stroke();

        //constructs a particle with the new randomized values
        new_particle = new Particle(rand_x, rand_y, x_dir, y_dir);

        //passes the constructed particles to an array of particles
        particle_array.push(new_particle);
    }
}

//function responsible for moving the particles
function particle_mover(speed) {
    for (var i = 0; i <= particle_array.length - 1; i++) {
        //code decides which particle we are currently moving
        current_particle = particle_array[i];

        //if the magnet flag is true, the x and y directions of the particle is altered to travel towards the mouse cursor position
        switch (magnet_flag){
            case true:
                x_dir = mouse_x - current_particle.x_pos;
                y_dir = mouse_y - current_particle.y_pos;

                grav_radius = Math.sqrt(Math.pow(x_dir,2) + Math.pow(y_dir,2));

                current_particle.x_pos += x_dir * speed;
                current_particle.y_pos += y_dir * speed;
            
            case false: 
                //if there is no magnetism, the particle will simply be propogated by adding its original direction to the particles current
                //x and y positions each frame
                current_particle.x_pos += current_particle.init_x_dir * speed;
                current_particle.y_pos += current_particle.init_y_dir * speed;
        }

        ctx.beginPath();
        ctx.strokeStyle = "white";
        
        //particle is passed to this function every frame to check for out of bounds particles
        generate_posdir(current_particle, i);

        ctx.closePath();
        ctx.stroke();

        draw_line(current_particle);
    }
}

//function responsible for randomly relocating particles if they travel out of bounds
function generate_posdir(current_particle, index) {
    //test to see if the particle is out of the canvas
    if (current_particle.x_pos >= win_width || current_particle.y_pos > win_height || current_particle.x_pos < 0 || current_particle.y_pos < 0) {
        //randomizing x and y positions
        rand_x = Math.floor(Math.random() * win_width);
        rand_y = Math.floor(Math.random() * win_height);

        x_dir = rand_range[Math.floor(Math.random() * 2)];
        y_dir = rand_range[Math.floor(Math.random()* 2)];

        //test like before to make sure no particles are stationary
        switch (x_dir) {
            case 0:
                y_dir = second_range[Math.floor(Math.random() * 2)];
                break;
        }
        switch (y_dir) {
            case 0:
                x_dir = second_range[Math.floor(Math.random() * 2)];
                break;
        }

        //setting the positions and directions with the given index
        particle_array[index].x_pos = rand_x;
        particle_array[index].y_pos = rand_y;
        
        particle_array[index].init_x_dir = x_dir;
        particle_array[index].init_y_dir = y_dir;
        ctx.arc(rand_x,rand_y, 2, 0, Math.PI*2, true);
    }
    else {
        //if the particle is not out of bounds, move it like normal
        ctx.arc(particle_array[index].x_pos, particle_array[index].y_pos, 2, 0, Math.PI*2, true);
    }
}

//this function is responsible for detecting whether particles fall within line drawing distance and drawing the line
function draw_line(current_particle) {
    for (var k = 0; k <= particle_array.length - 1; k++) {
        //using the distance formula to calculate the line distance
        line_distance = Math.sqrt((Math.pow((particle_array[k].x_pos - current_particle.x_pos),2) + Math.pow((particle_array[k].y_pos - current_particle.y_pos),2)));
        //testing the current particle against all other particles to see if they are within range
        if (line_distance < line_distance_threshold) {
            rand_color = Math.floor(Math.random() * color_array.length);
            ctx.strokeStyle = "orange";
            ctx.beginPath();
            ctx.moveTo(current_particle.x_pos, current_particle.y_pos);
            //drawing the line
            ctx.lineTo(particle_array[k].x_pos, particle_array[k].y_pos);
            ctx.closePath();
            ctx.stroke();
        }
    }
}

//this function is responsible for checking to see if this is the users first visit to the site
//if it is, data is passed for generative art project
//dont want database to be spammed with entries if the user is refreshing the page
function checkFirstVisit(particle_array) {
    if(document.cookie.indexOf('mycookie')==-1) {
      // cookie doesn't exist, create it now
      document.cookie = 'mycookie=1';
      pass_data(particle_array);
    }
    else {
      // not first visit, don't repass data
    }
  }

//function responsible for choosing the random particles for x and y position data passing to database
function pass_data(particle_array) {
    var length = particle_array.length;
    var rand_particle = Math.floor(Math.random() * length);
    var select_particle = particle_array[rand_particle];
    var particle_x = select_particle.x_pos;
    var particle_y = select_particle.y_pos;

    x_coord.value = parseInt(particle_x,10);
    y_coord.value = parseInt(particle_y,10);

    //submitting form so PHP code can run
    submit_btn.click();
}
