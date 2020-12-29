var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var body_div = document.getElementById('canvas-container');
var max_particle_input = document.getElementById('max-particle-input');
var line_distance_input = document.getElementById('line-distance-input');
var gol_form_button = document.getElementById('submit-button');

var url = window.location.href;

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

canvas.onmousedown = magnet_click;
canvas.onmouseup = magnet_unclick;

canvas.addEventListener("mousemove", function(event) {
    mouse_x = getMousePos(event).x;
    mouse_y = getMousePos(event).y;
})

function magnet_click(event) {
    magnet_flag = true;
    mouse_x = getMousePos(event).x;
    mouse_y = getMousePos(event).y;
}

function magnet_unclick(event) {
    magnet_flag = false;
}

function getMousePos(event) {
    var rect = canvas.getBoundingClientRect(), 
        scaleX = canvas.width / rect.width,    
        scaleY = canvas.height / rect.height;  
    
    return {
        x: (event.clientX - rect.left) * scaleX,   
        y: (event.clientY - rect.top) * scaleY    
    }
}

window.addEventListener('load', function() {
    window.requestAnimationFrame(animate);

    particle_generator(0, max_particle);
})

max_particle_input.addEventListener('change', function () {
    max_particle = max_particle_input.value;
    console.log("change");
    particle_array = [];
})

line_distance_input.addEventListener('change', function() {
    line_distance_threshold = line_distance_input.value;
})

function animate() {

    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "black";
    ctx.save();

    canvas.width = win_width;
    canvas.height = win_height;

    if (particle_array.length < max_particle) {
        particle_generator(particle_array.length, max_particle);
    }
   
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
        
        case false:
            speed = 1;
           
            particle_mover(speed);
            break;
    }
    window.requestAnimationFrame(animate);
}

function particle_generator(start, end) {
    for (var i = start; i <= end; i++) {
        rand_x = Math.floor(Math.random() * canvas.width);
        rand_y = Math.floor(Math.random() * canvas.height);
        x_dir = rand_range[Math.floor(Math.random() * 2)];
        y_dir = rand_range[Math.floor(Math.random() * 2)];

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

        new_particle = new Particle(rand_x, rand_y, x_dir, y_dir);

        particle_array.push(new_particle);
    }

    pass_data(particle_array);
}

function particle_mover(speed) {
    for (var i = 0; i <= particle_array.length - 1; i++) {
        current_particle = particle_array[i];

        switch (magnet_flag){
            case true:
                x_dir = mouse_x - current_particle.x_pos;
                y_dir = mouse_y - current_particle.y_pos;

                grav_radius = Math.sqrt(Math.pow(x_dir,2) + Math.pow(y_dir,2));

                particle_array[i].x_pos += x_dir * speed;
                particle_array[i].y_pos += y_dir * speed;
            
            case false: 
                particle_array[i].x_pos += particle_array[i].init_x_dir * speed;
                particle_array[i].y_pos += particle_array[i].init_y_dir * speed;
        }

        ctx.beginPath();
        ctx.strokeStyle = "white";
        
        generate_posdir(current_particle, i);

        ctx.closePath();
        ctx.stroke();

        draw_line(current_particle);
    }
}

function generate_posdir(current_particle, index) {
    if (current_particle.x_pos >= win_width || current_particle.y_pos > win_height || current_particle.x_pos < 0 || current_particle.y_pos < 0) {
        rand_x = Math.floor(Math.random() * win_width);
        rand_y = Math.floor(Math.random() * win_height);

        x_dir = rand_range[Math.floor(Math.random() * 2)];
        y_dir = rand_range[Math.floor(Math.random()* 2)];

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

        particle_array[index].x_pos = rand_x;
        particle_array[index].y_pos = rand_y;
        
        particle_array[index].init_x_dir = x_dir;
        particle_array[index].init_y_dir = y_dir;
        ctx.arc(rand_x,rand_y, 2, 0, Math.PI*2, true);
    }
    else {
        ctx.arc(particle_array[index].x_pos, particle_array[index].y_pos, 2, 0, Math.PI*2, true);
    }
}

function draw_line(current_particle) {
    for (var k = 0; k <= particle_array.length - 1; k++) {
        line_distance = Math.sqrt((Math.pow((particle_array[k].x_pos - current_particle.x_pos),2) + Math.pow((particle_array[k].y_pos - current_particle.y_pos),2)));
        if (line_distance < line_distance_threshold) {
            rand_color = Math.floor(Math.random() * color_array.length);
            ctx.strokeStyle = "orange";
            ctx.beginPath();
            ctx.moveTo(current_particle.x_pos, current_particle.y_pos);
            ctx.lineTo(particle_array[k].x_pos, particle_array[k].y_pos);
            ctx.closePath();
            ctx.stroke();
        }
    }
}

function pass_data(particle_array) {
    var length = particle_array.length;
    var rand_particle = Math.floor(Math.random() * length);
    var select_particle = particle_array[rand_particle];
    var particle_x = select_particle.x_pos;
    var particle_y = select_particle.y_pos;
    var x_coord = document.getElementById('x_coord');
    var y_coord = document.getElementById('y_coord');

    x_coord.value = particle_x;
    y_coord.value = particle_y;

    console.log(gol_form_button);
    
    // gol_form_button.click();
}
