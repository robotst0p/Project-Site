import time
import copy
from termcolor import colored
import mysql.connector
from mysql.connector import errorcode
import numpy as np


def tylers_particles():
    x_coords = []
    y_coords = []

    # cnx = mysql.connector.connect(user='meyercts_meyerct', password=',{xHc6evSy-b',
    #                               host='gator3315.hostgator.com', database='meyercts_particle_data')
    try:
        cnx = mysql.connector.connect(user='meyercts_meyerct', password='WS_ZVp^sI)x@',
                                      host='gator3315.hostgator.com', database='meyercts_particle_data')
        selector = cnx.cursor()
        query = ("SELECT x_coord FROM `data_table`")
        selector.execute(query)
        for x_coord in selector:
            # print(x_coord[0])
            x_coords.append(x_coord[0])
        selector.close()
        selector = cnx.cursor()
        query = ("SELECT y_coord FROM `data_table`")
        selector.execute(query)
        for y_coord in selector:
            # print(y_coord[0])
            y_coords.append(y_coord[0])
        # print(x_coords, len(x_coords))
        # print()
        # print(y_coords, len(y_coords))

    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Something is wrong with your user name or password")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("Database does not exist")
        else:
            print(err)
    else:
        cnx.close()
    gol_seed(x_coords, y_coords)


def gol_seed(x, y):
    ITERATIONS = 100
    breakloop = 0
    alive = colored('#', 'red')  # alive cell color
    dead = colored('#', 'cyan')  # dead cell color
    HEIGHT = 15
    WIDTH = 30
    a = np.column_stack((x, y))  # generates array from tyler's x and y values
    b = a.flatten()  # list of all values passed by tyler's lists
    b.sort()  # sorts list
    c = sorted(set(b))  # removes duplicates
    d = [0]*450

    if len(c) <= 450:
        for n in range(len(c)):  # replaces 0s in d with members of n
            d[n] = c[n]
    elif len(c) > 450:  # use the last 450 of n list
        c.reverse()
        for i in range(450):
            d[n] = c[n]
    for i in range(len(d)):  # alives are even
        if d[i] % 2 != 0:
            d[i] = alive
        else:
            d[i] = ' '
    Cells = np.resize(d, (30, 15))  # resize list to gol array dimensions
    g_o_l(Cells, breakloop, WIDTH, HEIGHT, alive, ITERATIONS, dead)


def g_o_l(Cells, breakloop, WIDTH, HEIGHT, alive, ITERATIONS, dead):
    while breakloop != ITERATIONS:
        print("\n\n")
        print()
        print('\n\n')
        # currentCells copies initial Cells array, undergoes testing
        currentCells = copy.deepcopy(Cells)

        ##########################################
        print("********************************")
        for y in range(HEIGHT):
            print("*", end='')
            for x in range(WIDTH):
                # print the # or ' '     # <---- main output block
                print(currentCells[x][y], end='')
            print("*", end='')
            print()  # newline printed at the end of row (HEIGHT)
        print("********************************", end='')
        ##########################################

        for x in range(WIDTH):
            for y in range(HEIGHT):
                # GET NEIGHBORING COORDS
                leftcoord = (x-1) % WIDTH  # WIDTH IS WRAPPING
                rightcoord = (x+1) % WIDTH
                abovecoord = (y-1) % HEIGHT
                belowcoord = (y+1) % HEIGHT

                # CHECK NEIGHBOR STATS
                neighbors = 0  # counter for live neighbors
                if currentCells[leftcoord][abovecoord] == alive:  # X#
                    neighbors += 1  # leftabove                                  #C#
                if currentCells[x][abovecoord] == alive:                 # Y##
                    neighbors += 1  # above
                if currentCells[rightcoord][abovecoord] == alive:
                    neighbors += 1  # aboveright
                if currentCells[leftcoord][y] == alive:
                    neighbors += 1  # left
                if currentCells[rightcoord][y] == alive:
                    neighbors += 1  # right
                if currentCells[leftcoord][belowcoord] == alive:
                    neighbors += 1  # belowleft
                if currentCells[x][belowcoord] == alive:
                    neighbors += 1  # middleblow
                if currentCells[rightcoord][belowcoord] == alive:
                    neighbors += 1  # belowright

                # alive cells stay alive
                if currentCells[x][y] == alive and (neighbors == 2 or neighbors == 3):
                    Cells[x][y] = alive
                elif currentCells[x][y] == dead and neighbors == 3:  # dead cells come alive
                    Cells[x][y] = alive
                else:
                    Cells[x][y] = dead  # die/dead

        breakloop += 1
        time.sleep(.2)
    report(Cells)


def report(matrix):  # to be passed to next transform - matrix consists of last Cells config
    print()


tylers_particles()
