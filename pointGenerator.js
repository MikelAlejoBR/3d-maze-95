/**
 * Generates pseudo-randomly a path of points.
 * @param  array entryPoint    The entry point
 * @param  int MAZESIZE   Size of the labyrinth
 * @param  int ADVANCELENGTH   The amount of movement to be done
 * @return array               Containing THREE.Vector3 elements
 */
function generatePoints(entryPoint, MAZESIZE, ADVANCELENGTH)
{
	var pointArray = new Array();

	entryPoint[Math.round(Math.random())] =
		getRandomIntInclusive(0,MAZESIZE);
	pointArray[0] = new THREE.Vector3(entryPoint[0], 1, entryPoint[1]);

	generatePointsWithFourFactors(pointArray);
	//generatePointsWithTwoFactors(pointArray);

	return(pointArray)
}

/**
 * Generates points based in two factors: wether we are moving in the X axis
 * or not, and wether we should increase or not.
 * @return array containing the generated points.
 */
function generatePointsWithTwoFactors(pointArray)
{
	var i = 1;
	while(i < POINTSTOGENERATE)
	{
		var areWeMovingInX = Math.round(Math.random());
		var doWeIncrease = Math.round(Math.random());
		if(!doWeIncrease)
		{
			doWeIncrease = -1;
		}

		lastPos = new THREE.Vector3(
			pointArray[i-1].getComponent(0),
			1,
			pointArray[i-1].getComponent(2)
		);

		if(areWeMovingInX)
		{
			lastPos.setX(
				lastPos.getComponent(0) + (doWeIncrease * ADVANCELENGTH)
			);
		}
		else
		{
			lastPos.setZ(
				lastPos.getComponent(2) + (doWeIncrease * ADVANCELENGTH)
			);
		}

		if(isLegalPos(lastPos, MAZESIZE))
		{
			lastMove = moveTo;
			pointArray[i] = lastPos;
			i++;
		}
	}

	return pointArray;
}

/**
 * Generates points based in the four coordinates: depending on wether we
 * can move towards North, East, South and West directions.
 * @return array containing the generated points.
 */
function generatePointsWithFourFactors(pointArray)
{
	const COORDINATES = [
		0,
		1,
		2,
		3
	];

	const NORTH = COORDINATES[0]; //+Z
	const EAST = COORDINATES[1]; //+X
	const SOUTH = COORDINATES[2]; //-X
	const WEST = COORDINATES[3]; //-Z

	var lastMove;
	if(entryPoint[0]) // It is located in the X axis
	{
		lastMove = COORDINATES[SOUTH];
	}
	else
	{
		lastMove = COORDINATES[WEST];
	}

	var i = 1;
	while(i < POINTSTOGENERATE)
	{
		var moveTo = getRandomIntInclusive(0, 3);
		if(moveTo != lastMove)
		{
			lastPos = new THREE.Vector3(
				pointArray[i-1].getComponent(0),
				1,
				pointArray[i-1].getComponent(2)
			);
			switch(moveTo)
			{
				case NORTH:
					lastPos.setZ(lastPos.getComponent(2) + ADVANCELENGTH);
					break;
				case EAST:
					lastPos.setX(lastPos.getComponent(0) + ADVANCELENGTH);
					break;
				case SOUTH:
					lastPos.setX(lastPos.getComponent(0) - ADVANCELENGTH);
					break;
				case WEST:
					lastPos.setZ(lastPos.getComponent(2) - ADVANCELENGTH);
					break;
			}

			if(isLegalPos(lastPos, MAZESIZE))
			{
				lastMove = moveTo;
				pointArray[i] = lastPos;
				i++;
			}
		}
	}

	return pointArray;
}

/**
 * Checks whether the position is inside the boundries and meets the
 * constraints
 * @param  Vector3   lastPos       vector containing the last generated
 *                                 position
 * @param  int  MAZESIZE      number indicating the size of the labyrinth
 * @return {Boolean}               returns true if the vector meets the
 *                                 constraints
 */
function isLegalPos(lastPos, MAZESIZE)
{
	var xpos = lastPos.getComponent(0);
	var zpos = lastPos.getComponent(2);

	if(xpos < 0 || xpos > MAZESIZE)
	{
		return false;
	}

	if (zpos < 0 || zpos > MAZESIZE)
	{
		return false;
	}

	return true;

}

/**
 * Gets random integer between the min and the max
 * @param  int min Minimum value
 * @param  int max Maximum value
 * @return int A value between min and max inclusive
 * @author © 2005-2017 Mozilla Developer Network and individual contributors.
 * @url https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/
 *      Global_Objects/Math/random
 */
function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
