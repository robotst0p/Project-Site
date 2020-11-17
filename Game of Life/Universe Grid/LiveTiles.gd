extends TileMap

var x_cor
var y_cor
onready var init_seed = self.get_used_cells()
var generationtimer = 100
var rng = RandomNumberGenerator.new()
var live_cells = Array()


func _ready():
	live_cells = init_seed
#	print(live_cells)


		
