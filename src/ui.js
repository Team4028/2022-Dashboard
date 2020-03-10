// Define UI elements
let ui = {
	fmsDebugMsg: document.getElementById('fmsDebugMsg'),
	robotCodeBuild: document.getElementById('robotCodeBuild'),
	robotScanTime: document.getElementById('robotScanTime'),
	
	// auton selectors
	openChooserWindowBtn: document.getElementById('openChooserWindowBtn'),
	
	// chassis

	//climber
	climberStatus: document.getElementById('climber-status'),

	targetRPM: document.getElementById('TargetRPM'),

	actualRPM: document.getElementById('ActualRPM'),
	

	//vision
	visionTargetIndicator: document.getElementById('visionTargetIndicator'),
	visionAngle1Indicator: document.getElementById('visionAngle1Indicator'),
	visionConnectionIndicator: document.getElementById('visionConnectionIndicator'),
	visionDistanceIndicator: document.getElementById('visionDistanceIndicator'),
		

	// camera
	camera: document.getElementById('camera'),

	powerCellCount: document.getElementById('powerCellCount'),

	isAltShot : document.getElementById('Is Alt Shot'),

	isReadyToShoot : document.getElementById('Is At Speed'),

	isSingulatorRunning : document.getElementById('Singulator'),

	isInfeedRunning : document.getElementById('Infeed'),

	shooterOffset : document.getElementById('shotOffset'),

	shooterDist : document.getElementById('shotDistance'),

	shooterSensorDistance : document.getElementById('sensorDist'),

	actval: document.getElementById('Actuator'),



	// Photo Eyes 
	midconvey: document.getElementById('Mid-Convey'),

	preconvey: document.getElementById('Pre-Covey'),

	postsingulator: document.getElementById('Post-Singulator'),
	
	postconvey: document.getElementById('Post-Convey')


};


// Key Listeners
// ========================================================================================
// header
// ========================================================================================
// robotState is in connection.js

NetworkTables.addKeyListener('/SmartDashboard/FMS Debug Msg', (key, value) => {
    ui.fmsDebugMsg.value = value;
});

NetworkTables.addKeyListener('/SmartDashboard/Robot Build', (key, value) => {
    ui.robotCodeBuild.value = value;
});

NetworkTables.addKeyListener('/SmartDashboard/Scan Time (2 sec roll avg)', (key, value) => {
    //ui.robotScanTime.value = value;
});
// ========================================================================================
// auton mode
// ========================================================================================
// Load list of prewritten autonomous modes
NetworkTables.addKeyListener('/SmartDashboard/Auton/options', (key, value) => {
	openChooserWindowBtn.disabled = false;
	openChooserWindowBtn.textContent = '= Click to Open Chooser Window =';
	
	clearAutonButtons();

    // dynamically build list of auton options
    for (let i = 0; i < value.length; i++) {
        addButton(value[i]);           
	}

	selectedAuton.value = "** Not selected **"
});

NetworkTables.addKeyListener('/SmartDashboard/Auton/default', (key, value) => {
	setAutonDefault(value.toString());
	selectedAuton.value = value;
});

NetworkTables.addKeyListener('/SmartDashboard/Auton/selected', (key, value) => {
	setAutonDefault(value.toString());
	selectedAuton.value = value;
});

// ========================================================================================
// auton starting side
// ========================================================================================
NetworkTables.addKeyListener('/SmartDashboard/Side Start/options', (key, value) => {
//function loadTestAutonSides() {
	openChooserWindowBtn.disabled = false;
	openChooserWindowBtn.textContent = '= Click to Open Chooser Window =';

	clearAutonSideButtons();

    // dynamically build list of auton options	
	for (let i = 0; i < value.length; i++) {
        addSideButton(value[i]);           
    }

	selectedSide.value = "** Not selected **"
});

NetworkTables.addKeyListener('/SmartDashboard/Side Start/default', (key, value) => {
	setSideDefault(value.toString());
	selectedSide.value = value;
});


// ========================================================================================
// Vision
// =======================================================================================
NetworkTables.addKeyListener('/SmartDashboard/Has Target', (key, value) => {
	if (value)	{
		ui.visionTargetIndicator.style = "background-color:green;";
		ui.visionAngle1Indicator.style = "background-color:green;";
		ui.visionConnectionIndicator.style = "background-color:green;"
		ui.visionTargetIndicator.textContent = "Target Acquired";
	} else {
		ui.visionTargetIndicator.style = "background-color: rgb(173, 9, 9);";
		ui.visionAngle1Indicator.style = "background-color: rgb(173, 9, 9);";
		ui.visionConnectionIndicator.style = "background-color: rgb(173, 9, 9);"
		ui.visionTargetIndicator.textContent = "Target not Acquired";

	}
});

NetworkTables.addKeyListener('/SmartDashboard/Angle 1', (key, value) => {	
	ui.visionAngle1Indicator.textContent = value + "\u00B0";
});

NetworkTables.addKeyListener('/SmartDashboard/Vision:Angle2InDegrees', (key, value) => {	
	ui.visionAngle2Indicator.textContent = value + "\u00B0";
});


NetworkTables.addKeyListener('/SmartDashboard/LL Distance', (key, value) => {	
	if(value < 600 && value != 0) {
		ui.visionDistanceIndicator.textContent = Math.round(value) + "in";
		if (value <= 600) {
			ui.visionDistanceIndicator.style = "background-color:green;";
		} 
	} else {
		ui.visionDistanceIndicator.style = "background-color: rgb(173, 9, 9);";
		ui.visionDistanceIndicator.textContent = "NO";
	}	
});

NetworkTables.addKeyListener('/SmartDashboard/Vision:IsPingable', (key, value) => {	
	if(value) {
		//ui.visionConnectionIndicator.style = "visibility:hidden;";
		ui.visionConnectionIndicator.style = "background-color:#2B3A42;";
	} else {
		//ui.visionConnectionIndicator.style = "visibility:visible;";
		ui.visionConnectionIndicator.style = "background-color:red;";
	}
});

// ========================================================================================
// POWERCELL COUNT 
// ========================================================================================

	
// ========================================================================================
// Shooter
// ========================================================================================

NetworkTables.addKeyListener('/SmartDashboard/Is At Speed', (key, value) =>
{
	if( value == true)
	{
		ui.isReadyToShoot.style = "background-color:green;";

		ui.isReadyToShoot.textContent = "Shoot";
	}
	else{
		ui.isReadyToShoot.style = "background-color: rgb(173, 9, 9);";
		ui.isReadyToShoot.textContent = "NOT READY";
	}
});
NetworkTables.addKeyListener('/SmartDashboard/Shot Distance', (key, value) =>
{
	ui.shooterDist.textContent = value;
});
NetworkTables.addKeyListener('/SmartDashboard/Shooter Offset', (key, value) =>
{
	ui.shooterOffset.textContent = value;
});
NetworkTables.addKeyListener('/SmartDashboard/Shooter Sensor Distance', (key, value) =>
{
	ui.shooterSensorDistance.textContent = value;
});
NetworkTables.addKeyListener('/SmartDashboard/Actuator Value', (key, value) =>
{
	ui.actval.textContent = Math.round(value * 100) / 100;
});
NetworkTables.addKeyListener('/SmartDashboard/Is Normal Shot', (key, value) =>
{
	if(!value)
	{
		ui.isAltShot.style = "background-color:red;";
		ui.isAltShot.textContent = "Alternate";
	}
	else{
		ui.isAltShot.style = "background-color:green";
		ui.isAltShot.textContent = "Normal";
	}
});
NetworkTables.addKeyListener('/SmartDashboard/Is Singulator Running', (key, value) =>
{
	if(value)
	{
		ui.isSingulatorRunning.style = "background-color:green;";
		ui.isSingulatorRunning.textContent = "Running";
	}
	else{
		ui.isSingulatorRunning.style = "background-color: rgb(173, 9, 9)";
		ui.isSingulatorRunning.textContent = "No";
	}
});
NetworkTables.addKeyListener('/SmartDashboard/Is Infeed Running', (key, value) =>
{
	if(value)
	{
		ui.isInfeedRunning.style = "background-color:green;";
		ui.isInfeedRunning.textContent = "Running";
	}
	else{
		ui.isInfeedRunning.style = "background-color: rgb(173, 9, 9)";
		ui.isInfeedRunning.textContent = "No";
	}
});

NetworkTables.addKeyListener('/SmartDashboard/POST-SINGULATOR', (key, value) =>
{
	if(!value)
	{
		ui.postsingulator.style = "background-color:green;";
	}
	else{
		ui.postsingulator.style = "background-color: rgb(173, 9, 9)";
	}
});

NetworkTables.addKeyListener('/SmartDashboard/PRE-SHOOTER SENSOR', (key, value) =>
{
	if(!value)
	{
		ui.postconvey.style = "background-color:green;";
	}
	else{
		ui.postconvey.style = "background-color: rgb(173, 9, 9)";
	}
});

NetworkTables.addKeyListener('/SmartDashboard/PRE-CONVEYOR SENSOR', (key, value) =>
{
	if(!value)
	{
		ui.preconvey.style = "background-color:green;";
	}
	else{
		ui.preconvey.style = "background-color: rgb(173, 9, 9)";
	}
});

NetworkTables.addKeyListener('/SmartDashboard/MID-CONVEYOR', (key, value) =>
{
	if(!value)
	{
		ui.midconvey.style = "background-color:green;";
	}
	else{
		ui.midconvey.style = "background-color: rgb(173, 9, 9)";
	}
});


NetworkTables.addKeyListener('/SmartDashboard/RPM', (key, value) =>
{
	ui.actualRPM.textContent = value * 10;
});
NetworkTables.addKeyListener('/SmartDashboard/Target RPM', (key, value) =>
{
	ui.targetRPM.textContent = value * 10;
});


// ========================================================================================
// misc 
// ========================================================================================
NetworkTables.addKeyListener('/SmartDashboard/CamSelection', (key, value) => {	
	camera.setAttribute('src', value);
});

addEventListener('error',(ev)=>{
    ipc.send('windowError',{mesg:ev.message,file:ev.filename,lineNumber:ev.lineno})
});