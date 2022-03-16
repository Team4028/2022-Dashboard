// Define UI elements
let ui = {
	fmsDebugMsg: document.getElementById('fmsDebugMsg'),
	robotCodeBuild: document.getElementById('robotCodeBuild'),
	robotScanTime: document.getElementById('robotScanTime'),
	
	// auton selectors
	openChooserWindowBtn: document.getElementById('openChooserWindowBtn'),
	
	// chassis
	fl: document.getElementById('FL'),
	fr: document.getElementById('FR'),
	rl: document.getElementById('RL'),
	rr: document.getElementById('RR'),
	
	//climber
	climberStatus: document.getElementById('climber-status'),

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

	isConveyorRunning : document.getElementById('Conveyor'),

	backRpm: document.getElementById('back-rpm'),

	frontRpm: document.getElementById('front-rpm'),

	kickerRpm: document.getElementById('kicker-rpm'),

	angle: document.getElementById('angle'),

	frontTarget: document.getElementById('front-target'),

	backTarget: document.getElementById('back-target'),

	kickerTarget: document.getElementById('kicker-target'),
	
	angleTarget: document.getElementById('angle-target'),

	shot: document.getElementById('shot'),

	shooterIndex: document.getElementById('index'),
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

// NetworkTables.addKeyListener('/SmartDashboard/Auton/selected', (key, value) => {
// 	setAutonDefault(value.toString());
// 	selectedAuton.value = value;
// });

NetworkTables.addKeyListener('/photonvision/C922_Pro_Stream_Webcam/targetPitch', (key, value) => {
	console.log(`/photonvision/C922_Pro_Stream_Webcam/targetPitch -> ${value}`);
	ui.targetRPM.textContent = value;
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

NetworkTables.addKeyListener('/SmartDashboard/Target X Offset', (key, value) => {	
	ui.visionAngle1Indicator.textContent = Math.round(value * 100) / 100 + "\u00B0";
});

NetworkTables.addKeyListener('/SmartDashboard/Vision:Angle2InDegrees', (key, value) => {	
	ui.visionAngle2Indicator.textContent = value + "\u00B0";
});


NetworkTables.addKeyListener('/SmartDashboard/Limelight Distance', (key, value) => {	
	if(value < 600 && value != 0) {
		ui.visionDistanceIndicator.textContent = Math.round(value * 10)/10 + "ft";
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
NetworkTables.addKeyListener('/SmartDashboard/Cell Count', (key, value) =>
{
	ui.powerCellCount.textContent = value;
});
NetworkTables.addKeyListener('/SmartDashboard/Shooter Offset', (key, value) =>
{
	ui.shooterOffset.textContent = value;
});
NetworkTables.addKeyListener('/SmartDashboard/Shooter Sensor Distance', (key, value) =>
{
	ui.shooterSensorDistance.textContent = value;
});
NetworkTables.addKeyListener('/SmartDashboard/Front Motor RPM', (key, value) =>
{
	ui.frontRpm.textContent = Math.round(value * 10) / 10;
});
NetworkTables.addKeyListener('/SmartDashboard/Back Motor RPM', (key, value) =>
{
	ui.backRpm.textContent = Math.round(value * 10) / 10;
});
NetworkTables.addKeyListener('/SmartDashboard/Kicker Motor RPM', (key, value) =>
{
	ui.kickerRpm.textContent = Math.round(value * 10) / 10;
});
NetworkTables.addKeyListener('/SmartDashboard/Angle', (key, value) =>
{
	ui.angle.textContent = Math.round(value * 10) / 10;
});
NetworkTables.addKeyListener('/SmartDashboard/Shot Front RPM', (key, value) =>
{
	ui.frontTarget.textContent = Math.round(value * 10) / 10;
});
NetworkTables.addKeyListener('/SmartDashboard/Shot Back RPM', (key, value) =>
{
	ui.backTarget.textContent = Math.round(value * 10) / 10;
});
NetworkTables.addKeyListener('/SmartDashboard/Shot Kicker RPM', (key, value) =>
{
	ui.kickerTarget.textContent = Math.round(value * 10) / 10;
});
NetworkTables.addKeyListener('/SmartDashboard/Actuator Value', (key, value) =>
{
	ui.angleTarget.textContent = Math.round(value * 10) / 10;
});

NetworkTables.addKeyListener('/SmartDashboard/Shot', (key, value) =>
{
	ui.shot.textContent = value;
});
NetworkTables.addKeyListener('/SmartDashboard/Shooter Index', (key, value) =>
{
	ui.shooterIndex.textContent = Math.round(value * 10) / 10;
});

NetworkTables.addKeyListener('/SmartDashboard/Singulator/Running', (key, value) =>
{
	if(value)
	{
		ui.isSingulatorRunning.style = "background-color:green;";
	}
	else{
		ui.isSingulatorRunning.style = "background-color: rgb(173, 9, 9)";
	}
});

NetworkTables.addKeyListener('/SmartDashboard/Singulator/Vbus', (key, value) =>
{
	ui.isSingulatorRunning.textContent = value;
});

NetworkTables.addKeyListener('/SmartDashboard/Infeed/Running', (key, value) =>
{
	if(value)
	{
		ui.isInfeedRunning.style = "background-color:green;";
	}
	else{
		ui.isInfeedRunning.style = "background-color: rgb(173, 9, 9)";
	}
});
NetworkTables.addKeyListener('/SmartDashboard/Infeed/Vbus', (key, value) =>
{
	ui.isInfeedRunning.textContent = value;
});
NetworkTables.addKeyListener('/SmartDashboard/Conveyor/Running', (key, value) =>
{
	if(value)
	{
		ui.isConveyorRunning.style = "background-color:green;";
	}
	else{
		ui.isConveyorRunning.style = "background-color: rgb(173, 9, 9)";
	}
});
NetworkTables.addKeyListener('/SmartDashboard/Conveyor/Vbus', (key, value) =>
{
	ui.isConveyorRunning.textContent = value;
});

NetworkTables.addKeyListener('/SmartDashboard/FL Angle', (key, value) =>
{
	ui.fl.textContent = Math.round(value * 10) / 10;
});

NetworkTables.addKeyListener('/SmartDashboard/FR Angle', (key, value) =>
{
	ui.fr.textContent = Math.round(value * 10) / 10;
});

NetworkTables.addKeyListener('/SmartDashboard/RL Angle', (key, value) =>
{
	ui.rl.textContent = Math.round(value * 10) / 10;
});

NetworkTables.addKeyListener('/SmartDashboard/RR Angle', (key, value) =>
{
	ui.rr.textContent = Math.round(value * 10) / 10;
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