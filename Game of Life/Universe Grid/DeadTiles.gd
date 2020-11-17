extends TileMap

onready var init_live_tiles = get_parent().get_node("LiveTiles").get("init_seed")
var start_tiles = Array()
var dead_cells = Array()
var start_coords = Vector2.ZERO
var index_remove

#func _ready():
#	for x in range(0, 1024):
#		for y in range(0, 600):
#			start_coords.x = x
#			start_coords.y = y
#			start_tiles.append(start_coords)
#	for tile in init_live_tiles:
#		index_remove = start_tiles.bsearch(tile,true)
#		start_tiles.remove(index_remove)
#	for tile in start_tiles:
#		set_cell(tile.x, tile.y, false, false, false, false)
#	print(init_live_tiles)
#	dead_cells = start_tiles

func _process(delta):
	pass
