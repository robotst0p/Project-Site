var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var body_div = document.getElementById('canvas-container');

let particle_array = [];
let rand_range = [-1,0,1];
let second_range = [-1,1];

let magnet_flag = false;

let mouse_x = 0;
let mouse_y = 0;
let rand_x = 0;
let rand_y = 0;
let y_dir = 0;
let x_dir = 0;
let rand_color = 0;

let win_height = window.innerHeight;
let win_width = window.innerWidth;

let max_particle = 500;
let new_particle = 0;
let current_particle = 0;

let line_distance = 0;

const color_array = ["black", "red", "green", "blue", "purple", "yellow", "orange"];

//particle class constructors
class Particle {

    constructor(x_pos, y_pos, init_x_dir, init_y_dir) {
        this.x_pos = x_pos;
        this.y_pos = y_pos;
        this.init_x_dir = init_x_dir;
        this.init_y_dir = init_y_dir;
    }

    radius() {
        return 8;
    }
}

document.onmousedown = magnet_click;
document.onmouseup = magnet_unclick;

function magnet_click(event){
    magnet_flag = true;
    mouse_x = event.clientX;
    mouse_y = event.clientY;
}

function magnet_unclick(event){
    magnet_flag = false;
}

window.addEventListener('load', function() {
    window.requestAnimationFrame(animate);
    canvas.width = win_width;
    canvas.height = win_height;

    for (var i = 0; i <= max_particle; i++) {
        rand_x = Math.floor(Math.random() * win_width);
        rand_y = Math.floor(Math.random() * win_height);
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
})

window.addEventListener("resize", function() {
    win_height = window.innerHeight;
    win_width = window.innerWidth;
    canvas.width = win_width;
    canvas.height = win_height;
})

function animate() {

    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, win_width, win_height);

    ctx.strokeStyle = "black";
    ctx.save();

    switch (magnet_flag) {
        case true:
            ctx.beginPath();
            ctx.strokeStyle = "blue";
            ctx.arc(mouse_x,mouse_y, 8, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.stroke();
            for (var i = 0; i <= particle_array.length - 1; i++) {
                current_particle = particle_array[i];
                x_dir = mouse_x - current_particle.x_pos;
                y_dir = mouse_y - current_particle.y_pos;

                particle_array[i].x_pos += x_dir/500;
                particle_array[i].y_pos += y_dir/500;
                    
                ctx.beginPath();
                ctx.strokeStyle = "black";
                if (current_particle.x_pos >= win_width || current_particle.y_pos > win_height || current_particle.x_pos < 0 || current_particle.y_pos < 0) {
                    rand_x = Math.floor(Math.random() * win_width);
                    rand_y = Math.floor(Math.random() * win_height);
                    x_dir = rand_range[Math.floor(Math.random() * 2)]
                    y_dir = rand_range[Math.floor(Math.random()*2)];
        
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
        
                    particle_array[i].x_pos = rand_x;
                    particle_array[i].y_pos = rand_y;

                    particle_array[i].init_x_dir = x_dir;
                    particle_array[i].init_y_dir = y_dir;

                    ctx.arc(rand_x,rand_y, 2, 0, Math.PI*2, true);
                }
                else {
                    ctx.arc(particle_array[i].x_pos, particle_array[i].y_pos, 2, 0, Math.PI*2, true);
                }

                ctx.closePath();
                ctx.stroke();

                for (var k = 0; k <= particle_array.length - 1; k++) {
                    line_distance = Math.sqrt((Math.pow((particle_array[k].x_pos - current_particle.x_pos),2) + Math.pow((particle_array[k].y_pos - current_particle.y_pos),2)));
                    if (line_distance < 50) {
                        rand_color = Math.floor(Math.random() * color_array.length);
                        ctx.strokeStyle = "black";
                        ctx.beginPath();
                        ctx.moveTo(current_particle.x_pos, current_particle.y_pos);
                        ctx.lineTo(particle_array[k].x_pos, particle_array[k].y_pos);
                        ctx.closePath();
                        ctx.stroke();
                    }
                }

            } 
            break;
        
        case false:
            for (var i = 0; i <= particle_array.length - 1; i++) {
                current_particle = particle_array[i];
        
                x_dir = Math.floor(Math.random() * 2) ;
                y_dir = Math.floor(Math.random() * 2) ;

                particle_array[i].x_pos += particle_array[i].init_x_dir * 1;
                particle_array[i].y_pos += particle_array[i].init_y_dir * 1;
        
                ctx.beginPath();
                ctx.strokeStyle = "black";
                if (current_particle.x_pos >= win_width || current_particle.y_pos > win_height || current_particle.x_pos < 0 || current_particle.y_pos < 0) {
                    rand_x = Math.floor(Math.random() * win_width);
                    rand_y = Math.floor(Math.random() * win_height);
                    x_dir = rand_range[Math.floor(Math.random() * 2)]
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
        
                    particle_array[i].x_pos = rand_x;
                    particle_array[i].y_pos = rand_y;
                    particle_array[i].init_x_dir = x_dir;
                    particle_array[i].init_y_dir = y_dir;
                    ctx.arc(rand_x,rand_y, 2, 0, Math.PI*2, true);
                }
                else {
                    ctx.arc(particle_array[i].x_pos, particle_array[i].y_pos, 2, 0, Math.PI*2, true);
                }
                ctx.closePath();
                ctx.stroke();
        
                for (var k = 0; k <= particle_array.length - 1; k++) {
                    line_distance = Math.sqrt((Math.pow((particle_array[k].x_pos - current_particle.x_pos),2) + Math.pow((particle_array[k].y_pos - current_particle.y_pos),2)));
                    if (line_distance < 100) {
                        rand_color = Math.floor(Math.random() * color_array.length);
                        ctx.strokeStyle = "black";
                        ctx.beginPath();
                        ctx.moveTo(current_particle.x_pos, current_particle.y_pos);
                        ctx.lineTo(particle_array[k].x_pos, particle_array[k].y_pos);
                        ctx.closePath();
                        ctx.stroke();
                    }
                }
                
            }
    }

    window.requestAnimationFrame(animate);
    
}



