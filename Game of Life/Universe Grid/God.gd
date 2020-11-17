extends Node

onready var live_cells = get_parent().get_node("LiveTiles").get("live_cells")
onready var init_live_tiles = get_parent().get_node("LiveTiles").get("init_seed")
onready var live_cell_placer = get_parent().get_node("LiveTiles")
onready var dead_cell_placer = get_parent().get_node("DeadTiles")

var death_threshold = 0
var birth_threshold = 0
var ytest = 0 
var test_count = 0 
var numcells = 0
var deathcellcount = 0
var birthcellcount = 0 
var generation_num = 0

var iteration_timer = 1

var test_cell = Vector2.ZERO
var test_birth_cell = Vector2.ZERO
var start_coords = Vector2.ZERO

var celltest = Vector2(39,16)

var start_tiles = Array()
var dead_cells = Array()
var generation_deaths = Array()
var possible_birth_cells = Array()
var generation_births = Array()

var check_index
var xtest
var birthcount
var index_remove

func _ready():
	print(live_cells)
	for x in range(0, 1024):
		for y in range(0, 600):
			start_coords.x = x
			start_coords.y = y
			start_tiles.append(start_coords)
	for tile in init_live_tiles:
		index_remove = start_tiles.bsearch(tile, true)
		start_tiles.erase(tile)
	for tile in start_tiles:
		dead_cell_placer.set_cell(tile.x, tile.y, false, false, false, false)
	dead_cells = start_tiles
	check_index = dead_cell_placer.get_cellv(celltest)

func iteration():
	print("New Generation")
	
	live_cells = live_cell_placer.get_used_cells()
	dead_cells = dead_cell_placer.get_used_cells()
	
	for cell in live_cells:
		numcells += 1
		xtest = -1
		for ytest in range(-1,2):
			test_count += 1
			test_cell.x = cell.x + xtest
			test_cell.y = cell.y + ytest
			check_index = dead_cell_placer.get_cellv(test_cell)
			if (check_index == -1):
				death_threshold += 1
			else:
				possible_birth_cells.append(test_cell)
		ytest = 0
		xtest = 1
		for ytest in range(-1,2):
			test_count += 1
			test_cell.x = cell.x + xtest
			test_cell.y = cell.y + ytest
			check_index = dead_cell_placer.get_cellv(test_cell)
			if (check_index == -1):
				death_threshold += 1
			else:
				possible_birth_cells.append(test_cell)
		ytest = 0
		xtest = 0
		for ytest in range(-1,1):
			if (ytest == 0):
				ytest += 1
			test_count +=1
			test_cell.x = cell.x + xtest
			test_cell.y = cell.y + ytest
			check_index = dead_cell_placer.get_cellv(test_cell)
			if (check_index == -1):
				death_threshold += 1
			else:
				possible_birth_cells.append(test_cell)
		ytest = 0
		if (death_threshold < 2 or death_threshold > 3):
			generation_deaths.append(cell)
		death_threshold = 0
		
	for cell in possible_birth_cells:
		test_birth_cell = cell
		birthcount = possible_birth_cells.count(cell)
		if (birthcount > 1):
			possible_birth_cells.erase(cell)
	
	for cell in possible_birth_cells:
		numcells += 1
		xtest = -1
		for ytest in range(-1,2):
			test_count += 1
			test_cell.x = cell.x + xtest
			test_cell.y = cell.y + ytest
			check_index = dead_cell_placer.get_cellv(test_cell)
			if (check_index == -1):
				death_threshold += 1
		ytest = 0
		xtest = 1
		for ytest in range(-1,2):
			test_count += 1
			test_cell.x = cell.x + xtest
			test_cell.y = cell.y + ytest
			check_index = dead_cell_placer.get_cellv(test_cell)
			if (check_index == -1):
				death_threshold += 1
		ytest = 0
		xtest = 0
		for ytest in range(-1,1):
			if (ytest == 0):
				ytest += 1
			test_count +=1
			test_cell.x = cell.x + xtest
			test_cell.y = cell.y + ytest
			check_index = dead_cell_placer.get_cellv(test_cell)
			if (check_index == -1):
				death_threshold += 1
		ytest = 0
		if (death_threshold == 3):
			generation_births.append(cell)
		death_threshold = 0
		
	for cell in generation_deaths:
		for i in range(0, generation_deaths.size()):
			if (generation_deaths[i] == cell):
				deathcellcount += 1
		if (deathcellcount > 1):
			generation_deaths.erase(cell)
		deathcellcount = 0
		
	for cell in generation_births:
		for i in range(0, generation_births.size()):
			if (generation_births[i] == cell):
				birthcellcount += 1
		if (birthcellcount > 1):
			generation_births.erase(cell)
		birthcellcount = 0 
		
	for cell in generation_deaths:
		live_cell_placer.set_cellv(cell,-1)
		dead_cell_placer.set_cell(cell.x, cell.y, false, false, false, false)
		
	generation_deaths.clear()
	
	for cell in generation_births:
		possible_birth_cells.erase(cell)
		dead_cell_placer.set_cellv(cell, -1)
		live_cell_placer.set_cell(cell.x, cell.y, false, false, false, false)
		
	generation_births.clear()
	generation_num += 1
	
	print("Generation: " + str(generation_num) + " has ended")
	
func _process(delta):
	if (iteration_timer > 0):
		iteration_timer -= 1
	elif (iteration_timer == 0):
		iteration()
		iteration_timer = 1
	
