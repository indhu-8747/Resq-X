export type SupportedLanguage = 'en' | 'ta' | 'hi';

export interface Translations {
  // Brand & Nav
  appName: string;
  tagline: string;
  searchRescue: string;
  navHome: string;
  navCamera: string;
  navSensors: string;
  navObstacle: string;
  navLogs: string;
  navSettings: string;
  openingScreen: string;

  // Header Telemetry
  bluetoothConnected: string;
  bluetoothDisconnected: string;
  battery: string;
  voltage: string;
  controller: string;

  // Rover Status
  roverTitle: string;
  roverSubtitle: string;
  roverStatus: string;
  roverState: string;
  stateStopped: string;
  stateMoving: string;
  stateStandby: string;
  connection: string;
  signalQuality: string;
  roverOnline: string;
  roverOffline: string;
  returnToHome: string;
  roverIp: string;
  roverConnected: string;
  roverDisconnected: string;

  // Quick Controls
  quickControls: string;
  searchlight: string;
  buzzer: string;
  on: string;
  off: string;

  // Alerts
  alert: string;
  activeAlert: string;
  noAlerts: string;
  highGasDetected: string;
  gasSensor: string;
  viewDetails: string;
  critical: string;
  warning: string;
  normal: string;
  safe: string;
  caution: string;
  danger: string;

  // Obstacle Detection
  obstacleDetection: string;
  obstacleSubtitle: string;
  distance: string;
  clear: string;
  obstacleDetected: string;
  frontObstacle: string;
  rangeBumper: string;
  rangeLimit: string;
  pathClear: string;
  objectClose: string;
  immediateRisk: string;

  // Sensors
  sensorsTitle: string;
  sensorsSubtitle: string;
  temperature: string;
  gasLevel: string;
  soundLevel: string;
  threshold: string;
  viewSensors: string;

  // Camera
  cameraTitle: string;
  cameraSubtitle: string;
  cameraStatus: string;
  roverCamera: string;
  deviceCamera: string;
  roverCameraOffline: string;
  roverCameraUnavailable: string;
  retryConnection: string;
  cameraSettings: string;
  openLiveCamera: string;
  live: string;
  snapshot: string;
  fullScreen: string;
  enableCamera: string;
  stopCamera: string;

  // Logs
  logsTitle: string;
  logsSubtitle: string;
  totalEvents: string;
  alertsCount: string;
  warningsCount: string;
  systemEvents: string;
  searchLogs: string;
  downloadLogData: string;
  downloadFiltered: string;
  downloadAll: string;
  clearLogs: string;
  simulateEvent: string;
  time: string;
  type: string;
  event: string;
  source: string;
  status: string;

  // Settings
  settingsTitle: string;
  settingsSubtitle: string;
  connectionSettings: string;
  sensorConfig: string;
  safetyAlerts: string;
  cameraConfig: string;
  displayPreferences: string;
  saveSettings: string;
  resetDefaults: string;
  testConnection: string;
  testCamera: string;
  settingsSaved: string;

  // Additional camera & sensor labels
  mobileCamera: string;
  esp32Cam: string;
  gasMq2: string;
  mq2Sensor: string;
  demoModeBadge: string;
  demoDescription: string;

  // System Status & Neutral Alert State
  systemStatus: string;
  allSystemsNormal: string;
  noActiveAlertsDesc: string;
  nominal: string;

  // Rover Status Card
  bluetoothLE: string;

  // Controls & Status
  controls: string;
  bleOk: string;
  online: string;
  offline: string;

  // Sensor & Obstacle Summary
  sensorsCount: string;
  rangeLabel: string;

  // User Profile Dropdown Menu
  profileMenu: string;
  userProfile: string;
  operatorRole: string;
  language: string;
  signOut: string;

  // Splash / Opening
  overview: string;
  systemOverview: string;
  systemOverviewDesc: string;
  close: string;
  techAtmosphere: string;
  smarterTech: string;
  saferRescues: string;

  // Buzzer & Hardware Settings
  acousticBuzzer: string;
  chassisPiezoDesc: string;
  safetyEnforced: string;
  safetyNotice: string;
  buzzerActiveHigh: string;
  buzzerActiveLow: string;
  buzzerLogic: string;
  buzzerGpio: string;
  testBuzzer: string;
  buzzerTesting: string;
  buzzerTestSuccess: string;
  buzzerHardwareConfig: string;

  // Demo Mode Card
  demoActive: string;
  liveAwaiting: string;
  demoStatus: string;
  demoDescNotice: string;
  demoTelemetry: string;
  demoDataOn: string;
  demoDataOff: string;

  // System Info Card
  systemInfo: string;
  hardwareSoftwareSpecs: string;
  systemDesignation: string;
  coreMicrocontroller: string;
  operatorController: string;
  opticalCamera: string;
  obstacleSensor: string;
  atmosphericSensors: string;
  batteryPower: string;
  telemetryLink: string;
  operatorSoftware: string;
  firmwareBuild: string;

  // Display Settings
  themeMode: string;
  darkMode: string;
  lightMode: string;
  dashboardDensity: string;
  densityComfortable: string;
  densityCompact: string;
  showSensorStatus: string;
  showBatteryVoltage: string;
  showDemoIndicator: string;
  show: string;
  hide: string;
  enabled: string;
  disabled: string;

  // Obstacle Settings
  cautionDistance: string;
  dangerDistance: string;
  proximityThresholds: string;
  triggerCaution: string;
  triggerDanger: string;
  fieldOfView: string;

  // Log Categories
  catAll: string;
  catAlerts: string;
  catWarnings: string;
  catSensors: string;
  catConnection: string;
  catCamera: string;
  catSystem: string;

  // Sweeps & Diagnostics
  pauseSweep: string;
  liveSweep: string;
  systemLink: string;
  rangeSimulation: string;
  technicalDiagnostics: string;
  simulateHazard: string;
  action: string;
  gasNormal: string;
  gasHigh: string;
}

export const translations: Record<SupportedLanguage, Translations> = {
  en: {
    appName: 'RESQ-X',
    tagline: 'SEARCH & RESCUE ROVER',
    searchRescue: 'SEARCH & RESCUE',
    navHome: 'Home',
    navCamera: 'Live Camera',
    navSensors: 'Sensors',
    navObstacle: 'Obstacle Detection',
    navLogs: 'Logs',
    navSettings: 'Settings',
    openingScreen: 'Opening Screen',

    bluetoothConnected: 'Connected',
    bluetoothDisconnected: 'Disconnected',
    battery: 'Battery',
    voltage: 'Voltage',
    controller: 'Controller',

    roverTitle: 'RESQ-X',
    roverSubtitle: '4WD Search & Rescue Rover',
    roverStatus: 'Rover Status',
    roverState: 'Rover State',
    stateStopped: 'Stopped',
    stateMoving: 'Moving',
    stateStandby: 'Standby',
    connection: 'Connection',
    signalQuality: 'Signal',
    roverOnline: 'Online',
    roverOffline: 'Offline',
    returnToHome: 'Back to Dashboard',
    roverIp: 'Rover IP Address',
    roverConnected: 'Connected',
    roverDisconnected: 'Disconnected',

    quickControls: 'Quick Controls',
    searchlight: 'Searchlight',
    buzzer: 'Alarm Buzzer',
    on: 'ON',
    off: 'OFF',

    alert: 'Alert',
    activeAlert: 'Active Alert',
    noAlerts: 'No Active Alerts',
    highGasDetected: 'High Gas Level Detected',
    gasSensor: 'Gas Sensor',
    viewDetails: 'View Details',
    critical: 'DANGER',
    warning: 'WARNING',
    normal: 'NORMAL',
    safe: 'CLEAR',
    caution: 'CAUTION',
    danger: 'DANGER',

    obstacleDetection: 'Obstacle Detection',
    obstacleSubtitle: 'Front proximity monitoring',
    distance: 'Distance',
    clear: 'CLEAR',
    obstacleDetected: 'DANGER',
    frontObstacle: 'The path ahead is clear.',
    rangeBumper: '0 cm',
    rangeLimit: '80 cm',
    pathClear: 'Safe distance.',
    objectClose: 'Object getting close.',
    immediateRisk: 'Immediate obstacle risk.',

    sensorsTitle: 'Sensors',
    sensorsSubtitle: 'Live rover environment monitoring',
    temperature: 'Temperature',
    gasLevel: 'Gas Level',
    soundLevel: 'Sound Level',
    threshold: 'Limit',
    viewSensors: 'View Sensors',

    cameraTitle: 'Live Camera',
    cameraSubtitle: 'Real-time video feed',
    cameraStatus: 'Camera Status',
    roverCamera: 'Rover Camera',
    deviceCamera: 'Device Camera',
    roverCameraOffline: 'Rover Camera Offline',
    roverCameraUnavailable: 'The rover camera is currently unavailable.',
    retryConnection: 'Retry Connection',
    cameraSettings: 'Camera Settings',
    openLiveCamera: 'Open Live Camera',
    live: 'LIVE',
    snapshot: 'Snapshot',
    fullScreen: 'Full Screen',
    enableCamera: 'Enable Camera',
    stopCamera: 'Stop Camera',

    logsTitle: 'Logs',
    logsSubtitle: 'Rover activity and safety event record',
    totalEvents: 'Total Events',
    alertsCount: 'Alerts',
    warningsCount: 'Warnings',
    systemEvents: 'System',
    searchLogs: 'Search logs...',
    downloadLogData: 'Download Log Data',
    downloadFiltered: 'Filtered Logs (CSV)',
    downloadAll: 'All Logs (CSV)',
    clearLogs: 'Clear Logs',
    simulateEvent: 'Simulate Event',
    time: 'Time',
    type: 'Type',
    event: 'Event',
    source: 'Source',
    status: 'Status',

    settingsTitle: 'Settings',
    settingsSubtitle: 'Configure rover connection, sensors, and safety alerts',
    connectionSettings: 'Connection',
    sensorConfig: 'Sensors',
    safetyAlerts: 'Safety & Alerts',
    cameraConfig: 'Camera',
    displayPreferences: 'Display',
    saveSettings: 'Save Settings',
    resetDefaults: 'Reset to Defaults',
    testConnection: 'Test Connection',
    testCamera: 'Test Camera',
    settingsSaved: 'Settings saved successfully.',
    mobileCamera: 'Mobile Camera',
    esp32Cam: 'ESP32-CAM',
    gasMq2: 'MQ-2 Gas Sensor',
    mq2Sensor: 'MQ-2 Gas Sensor',
    demoModeBadge: 'Simulation Active',
    demoDescription: 'Simulated atmospheric telemetry streaming to dashboard',

    // System Status
    systemStatus: 'System Status',
    allSystemsNormal: 'All Systems Normal',
    noActiveAlertsDesc: 'No active safety alerts',
    nominal: 'Nominal',

    // Rover Status Card
    bluetoothLE: 'Bluetooth LE',

    // Controls & Status
    controls: 'Controls',
    bleOk: 'BLE Ready',
    online: 'Online',
    offline: 'Offline',

    // Sensor & Obstacle Summary
    sensorsCount: '3 Sensors',
    rangeLabel: 'Range',

    // User Profile Dropdown Menu
    profileMenu: 'Operator Profile',
    userProfile: 'User Profile',
    operatorRole: 'Rescue Operator',
    language: 'Language',
    signOut: 'Sign Out',

    // Splash / Opening
    overview: 'Overview',
    systemOverview: 'System Overview',
    systemOverviewDesc: 'RESQ-X is an AI-powered search-and-rescue rover designed to help operators monitor hazardous environments and support safer rescue operations.',
    close: 'Close',
    techAtmosphere: 'AI-Powered Search & Rescue Rover',
    smarterTech: 'Smarter Technology.',
    saferRescues: 'Safer Rescues.',

    // Buzzer & Hardware Settings
    acousticBuzzer: 'Acoustic Buzzer Alarm',
    chassisPiezoDesc: 'Chassis piezo sounder for warnings and location beacon',
    safetyEnforced: 'Safety Enforced',
    safetyNotice: 'Active alarms trigger dashboard banners, logs, and physical rover buzzer.',
    buzzerActiveHigh: 'Active HIGH (Standard)',
    buzzerActiveLow: 'Active LOW (Inverted)',
    buzzerLogic: 'Buzzer Signal Logic',
    buzzerGpio: 'Buzzer GPIO Pin',
    testBuzzer: 'Test Physical Buzzer',
    buzzerTesting: 'Triggering Sound...',
    buzzerTestSuccess: 'Buzzer Signal Dispatched OK',
    buzzerHardwareConfig: 'Rover Buzzer Hardware Link',

    // Demo Mode Card
    demoActive: 'DEMO ACTIVE',
    liveAwaiting: 'LIVE AWAITING',
    demoStatus: 'Mode Status',
    demoDescNotice: 'Physical ESP32 sensors and HC-SR04 ultrasonic modules are in development. This mode simulates continuous telemetry so you can safely test thresholds, alerts, and viewport behaviors.',
    demoTelemetry: 'Simulation Telemetry',
    demoDataOn: 'DEMO DATA ON',
    demoDataOff: 'DEMO DATA OFF',

    // System Info Card
    systemInfo: 'System Information',
    hardwareSoftwareSpecs: 'Hardware & Software Specifications',
    systemDesignation: 'System Designation',
    coreMicrocontroller: 'Core Microcontroller',
    operatorController: 'Operator Controller',
    opticalCamera: 'Optical Camera Unit',
    obstacleSensor: 'Obstacle Sensor',
    atmosphericSensors: 'Atmospheric Sensors',
    batteryPower: 'Battery Power',
    telemetryLink: 'Telemetry Link',
    operatorSoftware: 'Operator Software',
    firmwareBuild: 'Firmware / Build',

    // Display Settings
    themeMode: 'Theme Mode',
    darkMode: 'Dark',
    lightMode: 'Light',
    dashboardDensity: 'Dashboard Density',
    densityComfortable: 'Comfortable',
    densityCompact: 'Compact',
    showSensorStatus: 'Show Sensor Status',
    showBatteryVoltage: 'Show Battery & Voltage',
    showDemoIndicator: 'Show Demo Indicator',
    show: 'SHOW',
    hide: 'HIDE',
    enabled: 'ENABLED',
    disabled: 'DISABLED',

    // Obstacle Settings
    cautionDistance: 'Caution Distance',
    dangerDistance: 'Danger Distance',
    proximityThresholds: 'Proximity Alert Thresholds',
    triggerCaution: 'Trigger caution state',
    triggerDanger: 'Trigger critical collision alert',
    fieldOfView: 'Effective Range: 2–80 cm (Field: 15°)',

    // Log Categories
    catAll: 'All',
    catAlerts: 'Alerts',
    catWarnings: 'Warnings',
    catSensors: 'Sensors',
    catConnection: 'Connection',
    catCamera: 'Camera',
    catSystem: 'System',

    // Sweeps & Diagnostics
    pauseSweep: 'Pause Sweep',
    liveSweep: 'Live Range Sweep',
    systemLink: 'System Link',
    rangeSimulation: 'Range Simulation',
    technicalDiagnostics: 'Technical Diagnostics',
    simulateHazard: 'Simulate Hazard',
    action: 'Action',
    gasNormal: 'Normal',
    gasHigh: 'High',
  },

  ta: {
    appName: 'RESQ-X',
    tagline: 'மீட்பு மற்றும் தேடல் ரோவர்',
    searchRescue: 'மீட்பு பணி',
    navHome: 'முகப்பு',
    navCamera: 'நேரடி கேமரா',
    navSensors: 'சென்சார்கள்',
    navObstacle: 'தடையறிதல்',
    navLogs: 'பதிவுகள்',
    navSettings: 'அமைப்புகள்',
    openingScreen: 'தொடக்க திரை',

    bluetoothConnected: 'இணைக்கப்பட்டது',
    bluetoothDisconnected: 'துண்டிக்கப்பட்டது',
    battery: 'பேட்டரி',
    voltage: 'மின்னழுத்தம்',
    controller: 'கன்ட்ரோலர்',

    roverTitle: 'RESQ-X',
    roverSubtitle: '4WD தேடல் & மீட்பு ரோவர்',
    roverStatus: 'ரோவர் நிலை',
    roverState: 'இயக்க நிலை',
    stateStopped: 'நிறுத்தப்பட்டது',
    stateMoving: 'நகர்கிறது',
    stateStandby: 'தயார் நிலை',
    connection: 'இணைப்பு',
    signalQuality: 'சமிக்ஞை',
    roverOnline: 'ஆன்லைன்',
    roverOffline: 'ஆஃப்லைன்',
    returnToHome: 'டாஷ்போர்டுக்குத் திரும்பு',
    roverIp: 'ரோவர் IP முகவரி',
    roverConnected: 'இணைக்கப்பட்டது',
    roverDisconnected: 'இணைப்பு துண்டிக்கப்பட்டது',

    quickControls: 'விரைவு கட்டுப்பாடுகள்',
    searchlight: 'தேடல் விளக்கு',
    buzzer: 'ஒலிப்பான்',
    on: 'இயக்கு',
    off: 'அணை',

    alert: 'எச்சரிக்கை',
    activeAlert: 'செயலில் உள்ள எச்சரிக்கை',
    noAlerts: 'எச்சரிக்கைகள் இல்லை',
    highGasDetected: 'அதிக வாயு கசிவு கண்டறியப்பட்டது',
    gasSensor: 'வாயு சென்சார்',
    viewDetails: 'விவரங்களை காண்க',
    critical: 'ஆபத்து',
    warning: 'எச்சரிக்கை',
    normal: 'இயல்பு',
    safe: 'தடை இல்லை',
    caution: 'கவனம்',
    danger: 'ஆபத்து',

    obstacleDetection: 'தடையறிதல்',
    obstacleSubtitle: 'முன்பக்க தடை கண்காணிப்பு',
    distance: 'தூரம்',
    clear: 'தடை இல்லை',
    obstacleDetected: 'ஆபத்து',
    frontObstacle: 'முன்பக்கம் பாதை தெளிவாக உள்ளது.',
    rangeBumper: '0 செ.மீ',
    rangeLimit: '80 செ.மீ',
    pathClear: 'பாதுகாப்பான தூரம்.',
    objectClose: 'பொருள் அருகில் வருகிறது.',
    immediateRisk: 'உடனடி மோதல் ஆபத்து.',

    sensorsTitle: 'சென்சார்கள்',
    sensorsSubtitle: 'நேரடி ரோவர் சென்சார் கண்காணிப்பு',
    temperature: 'வெப்பநிலை',
    gasLevel: 'வாயு அளவு',
    soundLevel: 'ஒலி அளவு',
    threshold: 'வரம்பு',
    viewSensors: 'சென்சார்களை காண்க',

    cameraTitle: 'நேரடி கேமரா',
    cameraSubtitle: 'நேரடி வீடியோ காட்சி',
    cameraStatus: 'கேமரா நிலை',
    roverCamera: 'ரோவர் கேமரா',
    deviceCamera: 'சாதன கேமரா',
    roverCameraOffline: 'ரோவர் கேமரா ஆஃப்லைன்',
    roverCameraUnavailable: 'ரோவர் கேமரா தற்போது கிடைக்கவில்லை.',
    retryConnection: 'மீண்டும் இணை',
    cameraSettings: 'கேமரா அமைப்புகள்',
    openLiveCamera: 'கேமராவை திறக்கவும்',
    live: 'நேரலை',
    snapshot: 'புகைப்படம்',
    fullScreen: 'முழுத்திரை',
    enableCamera: 'கேமராவை இயக்கு',
    stopCamera: 'கேமராவை நிறுத்து',

    logsTitle: 'பதிவுகள்',
    logsSubtitle: 'ரோவர் இயக்க மற்றும் பாதுகாப்பு நிகழ்வு பதிவுகள்',
    totalEvents: 'மொத்த நிகழ்வுகள்',
    alertsCount: 'எச்சரிக்கைகள்',
    warningsCount: 'கவனக்குறிப்புகள்',
    systemEvents: 'கணினி',
    searchLogs: 'பதிவுகளை தேட...',
    downloadLogData: 'பதிவுகளை பதிவிறக்கு',
    downloadFiltered: 'வடிகட்டப்பட்ட பதிவுகள் (CSV)',
    downloadAll: 'அனைத்து பதிவுகள் (CSV)',
    clearLogs: 'பதிவுகளை அழி',
    simulateEvent: 'நிகழ்வை உருவகப்படுத்து',
    time: 'நேரம்',
    type: 'வகை',
    event: 'நிகழ்வு',
    source: 'மூலம்',
    status: 'நிலை',

    settingsTitle: 'அமைப்புகள்',
    settingsSubtitle: 'ரோவர் இணைப்பு, சென்சார்கள் மற்றும் எச்சரிக்கைகளை கட்டமைக்கவும்',
    connectionSettings: 'இணைப்பு',
    sensorConfig: 'சென்சார்கள்',
    safetyAlerts: 'பாதுகாப்பு & எச்சரிக்கைகள்',
    cameraConfig: 'கேமரா',
    displayPreferences: 'திரை அமைப்புகள்',
    saveSettings: 'அமைப்புகளை சேமி',
    resetDefaults: 'மீட்டமை',
    testConnection: 'இணைப்பை சோதி',
    testCamera: 'கேமராவை சோதிக்கவும்',
    settingsSaved: 'அமைப்புகள் வெற்றிகரமாக சேமிக்கப்பட்டன.',
    mobileCamera: 'மொபைல் கேமரா',
    esp32Cam: 'ESP32-CAM',
    gasMq2: 'MQ-2 எரிவாயு சென்சார்',
    mq2Sensor: 'MQ-2 எரிவாயு சென்சார்',
    demoModeBadge: 'மாதிரி நேரலை',
    demoDescription: 'மாதிரி சுற்றுச்சூழல் அளவீடுகள் பெறப்படுகின்றன',

    // System Status
    systemStatus: 'கணினி நிலை',
    allSystemsNormal: 'அனைத்து அமைப்புகளும் சீராக உள்ளன',
    noActiveAlertsDesc: 'செயல்படும் பாதுகாப்பு எச்சரிக்கைகள் இல்லை',
    nominal: 'சீரானது',

    // Rover Status Card
    bluetoothLE: 'புளூடூத் LE',

    // Controls & Status
    controls: 'கட்டுப்பாடுகள்',
    bleOk: 'புளூடூத் தயார்',
    online: 'நேரலை',
    offline: 'ஆஃப்லைன்',

    // Sensor & Obstacle Summary
    sensorsCount: '3 சென்சார்கள்',
    rangeLabel: 'வரம்பு',

    // User Profile Dropdown Menu
    profileMenu: 'ஆபரேட்டர் சுயவிவரம்',
    userProfile: 'பயனர் விவரக்குறிப்பு',
    operatorRole: 'மீட்பு ஆபரேட்டர்',
    language: 'மொழி',
    signOut: 'வெளியேறு',

    // Splash / Opening
    overview: 'கண்ணோட்டம்',
    systemOverview: 'கணினி கண்ணோட்டம்',
    systemOverviewDesc: 'RESQ-X என்பது ஆபத்தான சூழல்களைக் கண்காணித்து பாதுகாப்பான மீட்புப் பணிகளை மேற்கொள்ள வடிவமைக்கப்பட்ட அதிநவீன மீட்பு ரோவர் ஆகும்.',
    close: 'மூடு',
    techAtmosphere: 'மீட்பு மற்றும் தேடல் ரோவர்',
    smarterTech: 'புத்திசாலி தொழில்நுட்பம்.',
    saferRescues: 'பாதுகாப்பான மீட்புகள்.',

    // Buzzer & Hardware Settings
    acousticBuzzer: 'ஒலிப்பான் அலாரம்',
    chassisPiezoDesc: 'எச்சரிக்கை மற்றும் இருப்பிட வழிகாட்டலுக்கான ரோவர் ஒலிப்பான்',
    safetyEnforced: 'பாதுகாப்பு அமலில் உள்ளது',
    safetyNotice: 'செயலில் உள்ள அலாரங்கள் எச்சரிக்கைகள், பதிவுகள் மற்றும் ரோவர் ஒலிப்பானை இயக்கும்.',
    buzzerActiveHigh: 'Active HIGH (இயல்பானது)',
    buzzerActiveLow: 'Active LOW (தலைகீழ்)',
    buzzerLogic: 'ஒலிப்பான் சிக்னல் முறை',
    buzzerGpio: 'ஒலிப்பான் GPIO பின்',
    testBuzzer: 'ஒலிப்பானை சோதி',
    buzzerTesting: 'ஒலி எழுப்பப்படுகிறது...',
    buzzerTestSuccess: 'ஒலிப்பான் சிக்னல் அனுப்பப்பட்டது',
    buzzerHardwareConfig: 'ரோவர் ஒலிப்பான் வன்பொருள் இணைப்பு',

    // Demo Mode Card
    demoActive: 'மாதிரி இயங்குகிறது',
    liveAwaiting: 'நேரலை காத்திருக்கிறது',
    demoStatus: 'நிலை பயன்முறை',
    demoDescNotice: 'வன்பொருள் சென்சார்கள் இணைக்கப்படாத போது இந்த மாதிரி தொலை அளவீடு தரவுகளை வழங்குகிறது.',
    demoTelemetry: 'மாதிரி தொலை அளவீடு',
    demoDataOn: 'மாதிரி தரவு இயக்கு',
    demoDataOff: 'மாதிரி தரவு அணை',

    // System Info Card
    systemInfo: 'கணினி தகவல்',
    hardwareSoftwareSpecs: 'வன்பொருள் & மென்பொருள் விவரங்கள்',
    systemDesignation: 'கணினி பெயர்',
    coreMicrocontroller: 'முதன்மை மைக்ரோகண்ட்ரோலர்',
    operatorController: 'ஆபரேட்டர் கன்ட்ரோலர்',
    opticalCamera: 'கேமரா பிரிவு',
    obstacleSensor: 'தடை சென்சார்',
    atmosphericSensors: 'சுற்றுச்சூழல் சென்சார்கள்',
    batteryPower: 'பேட்டரி திறன்',
    telemetryLink: 'தொலை அளவீட்டு இணைப்பு',
    operatorSoftware: 'ஆபரேட்டர் மென்பொருள்',
    firmwareBuild: 'மென்பொருள் பதிப்பு',

    // Display Settings
    themeMode: 'தீம் முறை',
    darkMode: 'டார்க்',
    lightMode: 'லைட்',
    dashboardDensity: 'திரை அடர்த்தி',
    densityComfortable: 'வசதியான',
    densityCompact: 'சுருக்கமான',
    showSensorStatus: 'சென்சார் நிலையை காட்டு',
    showBatteryVoltage: 'பேட்டரி & மின்னழுத்தத்தை காட்டு',
    showDemoIndicator: 'மாதிரி குறியீட்டை காட்டு',
    show: 'காட்டு',
    hide: 'மறை',
    enabled: 'செயலில்',
    disabled: 'முடங்கியது',

    // Obstacle Settings
    cautionDistance: 'கவன தூரம்',
    dangerDistance: 'ஆபத்து தூரம்',
    proximityThresholds: 'அருகாமை எச்சரிக்கை வரம்புகள்',
    triggerCaution: 'கவன எச்சரிக்கை வரம்பு',
    triggerDanger: 'மோதல் ஆபத்து வரம்பு',
    fieldOfView: 'பயனுள்ள வரம்பு: 2–80 செ.மீ (கோணம்: 15°)',

    // Log Categories
    catAll: 'அனைத்தும்',
    catAlerts: 'எச்சரிக்கைகள்',
    catWarnings: 'கவனக்குறிப்புகள்',
    catSensors: 'சென்சார்கள்',
    catConnection: 'இணைப்பு',
    catCamera: 'கேமரா',
    catSystem: 'கணினி',

    // Sweeps & Diagnostics
    pauseSweep: 'நிறுத்து',
    liveSweep: 'நேரடி கண்காணிப்பு',
    systemLink: 'கணினி இணைப்பு',
    rangeSimulation: 'வரம்பு சோதனை',
    technicalDiagnostics: 'தொழில்நுட்ப பகுப்பாய்வு',
    simulateHazard: 'ஆபத்து சோதனை',
    action: 'செயல்பாடு',
    gasNormal: 'இயல்பு',
    gasHigh: 'அதிகம்',
  },

  hi: {
    appName: 'RESQ-X',
    tagline: 'खोज एवं बचाव रोवर',
    searchRescue: 'खोज एवं बचाव',
    navHome: 'होम',
    navCamera: 'लाइव कैमरा',
    navSensors: 'सेंसर',
    navObstacle: 'बाधा पहचान',
    navLogs: 'लॉग्स',
    navSettings: 'सेटिंग्स',
    openingScreen: 'प्रारंभिक स्क्रीन',

    bluetoothConnected: 'कनेक्टेड',
    bluetoothDisconnected: 'डिस्कनेक्टेड',
    battery: 'बैटरी',
    voltage: 'वोल्टेज',
    controller: 'कंट्रोलर',

    roverTitle: 'RESQ-X',
    roverSubtitle: '4WD खोज एवं बचाव रोवर',
    roverStatus: 'रोवर स्थिति',
    roverState: 'सक्रिय स्थिति',
    stateStopped: 'रुका हुआ',
    stateMoving: 'गतिमान',
    stateStandby: 'स्टैंडबाय',
    connection: 'कनेक्शन',
    signalQuality: 'सिग्नल',
    roverOnline: 'ऑनलाइन',
    roverOffline: 'ऑफलाइन',
    returnToHome: 'डैशबोर्ड पर वापस जाएं',
    roverIp: 'रोवर IP पता',
    roverConnected: 'कनेक्टेड',
    roverDisconnected: 'डिस्कनेक्टेड',

    quickControls: 'त्वरित नियंत्रण',
    searchlight: 'सर्चलाइट',
    buzzer: 'अलार्म बज़र',
    on: 'चालू',
    off: 'बंद',

    alert: 'चेतावनी',
    activeAlert: 'सक्रिय चेतावनी',
    noAlerts: 'कोई सक्रिय चेतावनी नहीं',
    highGasDetected: 'अत्यधिक गैस स्तर का पता चला',
    gasSensor: 'गैस सेंसर',
    viewDetails: 'विवरण देखें',
    critical: 'खतरा',
    warning: 'चेतावनी',
    normal: 'सामान्य',
    safe: 'साफ',
    caution: 'सावधानी',
    danger: 'खतरा',

    obstacleDetection: 'बाधा पहचान',
    obstacleSubtitle: 'अग्र निकटता निगरानी',
    distance: 'दूरी',
    clear: 'रास्ता साफ है',
    obstacleDetected: 'खतरा',
    frontObstacle: 'सामने का रास्ता साफ है।',
    rangeBumper: '0 सेमी',
    rangeLimit: '80 सेमी',
    pathClear: 'सुरक्षित दूरी।',
    objectClose: 'वस्तु नजदीक आ रही है।',
    immediateRisk: 'टकराव का तात्कालिक खतरा।',

    sensorsTitle: 'सेंसर',
    sensorsSubtitle: 'रीयल-टाइम रोवर पर्यावरण निगरानी',
    temperature: 'तापमान',
    gasLevel: 'गैस स्तर',
    soundLevel: 'ध्वनि स्तर',
    threshold: 'सीमा',
    viewSensors: 'सेंसर देखें',

    cameraTitle: 'लाइव कैमरा',
    cameraSubtitle: 'रीयल-टाइम वीडियो फीड',
    cameraStatus: 'कैमरा स्थिति',
    roverCamera: 'रोवर कैमरा',
    deviceCamera: 'डिवाइस कैमरा',
    roverCameraOffline: 'रोवर कैमरा ऑफलाइन',
    roverCameraUnavailable: 'रोवर कैमरा वर्तमान में उपलब्ध नहीं है।',
    retryConnection: 'पुनः कनेक्ट करें',
    cameraSettings: 'कैमरा सेटिंग्स',
    openLiveCamera: 'लाइव कैमरा खोलें',
    live: 'लाइव',
    snapshot: 'फोटो लें',
    fullScreen: 'फुल स्क्रीन',
    enableCamera: 'कैमरा चालू करें',
    stopCamera: 'कैमरा बंद करें',

    logsTitle: 'लॉग्स',
    logsSubtitle: 'रोवर गतिविधि और सुरक्षा रिकॉर्ड',
    totalEvents: 'कुल इवेंट्स',
    alertsCount: 'अलर्ट्स',
    warningsCount: 'चेतावनियां',
    systemEvents: 'सिस्टम',
    searchLogs: 'लॉग्स खोजें...',
    downloadLogData: 'लॉग डेटा डाउनलोड करें',
    downloadFiltered: 'फ़िल्टर किए गए लॉग्स (CSV)',
    downloadAll: 'सभी लॉग्स (CSV)',
    clearLogs: 'लॉग्स साफ़ करें',
    simulateEvent: 'इवेंट सिमुलेट करें',
    time: 'समय',
    type: 'प्रकार',
    event: 'इवेंट',
    source: 'स्रोत',
    status: 'स्थिति',

    settingsTitle: 'सेटिंग्स',
    settingsSubtitle: 'रोवर कनेक्शन, सेंसर और सुरक्षा अलर्ट कॉन्फ़िगर करें',
    connectionSettings: 'कनेक्शन',
    sensorConfig: 'सेंसर',
    safetyAlerts: 'सुरक्षा एवं अलर्ट',
    cameraConfig: 'कैमरा',
    displayPreferences: 'डिस्प्ले',
    saveSettings: 'सेटिंग्स सहेजें',
    resetDefaults: 'रीसेट करें',
    testConnection: 'कनेक्शन जांचें',
    testCamera: 'कैमरा जांचें',
    settingsSaved: 'सेटिंग्स सफलतापूर्वक सहेजी गईं।',
    mobileCamera: 'मोबाइल कैमरा',
    esp32Cam: 'ESP32-CAM',
    gasMq2: 'MQ-2 गैस सेंसर',
    mq2Sensor: 'MQ-2 गैस सेंसर',
    demoModeBadge: 'सिमुलेशन सक्रिय',
    demoDescription: 'सिम्युलेटेड वायुमंडलीय डेटा डैशबोर्ड पर प्रदर्शित हो रहा है',

    // System Status
    systemStatus: 'सिस्टम स्थिति',
    allSystemsNormal: 'सभी प्रणालियां सामान्य हैं',
    noActiveAlertsDesc: 'कोई सक्रिय सुरक्षा अलर्ट नहीं है',
    nominal: 'सामान्य',

    // Rover Status Card
    bluetoothLE: 'ब्लूटूथ LE',

    // Controls & Status
    controls: 'नियंत्रण',
    bleOk: 'ब्लूटूथ तैयार',
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन',

    // Sensor & Obstacle Summary
    sensorsCount: '3 सेंसर',
    rangeLabel: 'सीमा',

    // User Profile Dropdown Menu
    profileMenu: 'ऑपरेटर प्रोफ़ाइल',
    userProfile: 'उपयोगकर्ता प्रोफ़ाइल',
    operatorRole: 'रेस्क्यू ऑपरेटर',
    language: 'भाषा',
    signOut: 'साइन आउट',

    // Splash / Opening
    overview: 'अवलोकन',
    systemOverview: 'सिस्टम अवलोकन',
    systemOverviewDesc: 'RESQ-X एक एआई-संचालित खोज एवं बचाव रोवर है जिसे खतरनाक वातावरण की निगरानी और सुरक्षित बचाव कार्यों के लिए डिज़ाइन किया गया है।',
    close: 'बंद करें',
    techAtmosphere: 'खोज एवं बचाव रोवर',
    smarterTech: 'स्मार्ट तकनीक।',
    saferRescues: 'सुरक्षित बचाव।',

    // Buzzer & Hardware Settings
    acousticBuzzer: 'ध्वनि बज़र अलार्म',
    chassisPiezoDesc: 'चेतावनी और स्थिति निर्धारण के लिए रोवर चेसिस बज़र',
    safetyEnforced: 'सुरक्षा लागू',
    safetyNotice: 'सक्रिय अलार्म डैशबोर्ड, लॉग और रोवर बज़र को सक्रिय करते हैं।',
    buzzerActiveHigh: 'Active HIGH (सामान्य)',
    buzzerActiveLow: 'Active LOW (इनवर्टेड)',
    buzzerLogic: 'बज़र सिग्नल लॉजिक',
    buzzerGpio: 'बज़र GPIO पिन',
    testBuzzer: 'भौतिक बज़र जांचें',
    buzzerTesting: 'ध्वनि भेजी जा रही है...',
    buzzerTestSuccess: 'बज़र सिग्नल सफलतापूर्वक भेजा गया',
    buzzerHardwareConfig: 'रोवर बज़र हार्डवेयर लिंक',

    // Demo Mode Card
    demoActive: 'डेमो सक्रिय',
    liveAwaiting: 'लाइव प्रतीक्षारत',
    demoStatus: 'मोड स्थिति',
    demoDescNotice: 'हार्डवेयर सेंसर कनेक्ट न होने पर यह मोड निरंतर टेलीमेट्री का अनुकरण करता है।',
    demoTelemetry: 'सिमुलेशन टेलीमेट्री',
    demoDataOn: 'डेमो डेटा चालू',
    demoDataOff: 'डेमो डेटा बंद',

    // System Info Card
    systemInfo: 'सिस्टम जानकारी',
    hardwareSoftwareSpecs: 'हार्डवेयर एवं सॉफ्टवेयर विनिर्देश',
    systemDesignation: 'सिस्टम पदनाम',
    coreMicrocontroller: 'मुख्य माइक्रोकंट्रोलर',
    operatorController: 'ऑपरेटर कंट्रोलर',
    opticalCamera: 'ऑप्टिकल कैमरा यूनिट',
    obstacleSensor: 'बाधा सेंसर',
    atmosphericSensors: 'पर्यावरण सेंसर',
    batteryPower: 'बैटरी पावर',
    telemetryLink: 'टेलीमेट्री लिंक',
    operatorSoftware: 'ऑपरेटर सॉफ्टवेयर',
    firmwareBuild: 'फ़र्मवेयर / बिल्ड',

    // Display Settings
    themeMode: 'थीम मोड',
    darkMode: 'डार्क',
    lightMode: 'लाइट',
    dashboardDensity: 'डैशबोर्ड घनत्व',
    densityComfortable: 'आरामदायक',
    densityCompact: 'सघन',
    showSensorStatus: 'सेंसर स्थिति दिखाएं',
    showBatteryVoltage: 'बैटरी एवं वोल्टेज दिखाएं',
    showDemoIndicator: 'डेमो संकेतक दिखाएं',
    show: 'दिखाएं',
    hide: 'छिपाएं',
    enabled: 'सक्षम',
    disabled: 'अक्षम',

    // Obstacle Settings
    cautionDistance: 'सावधानी दूरी',
    dangerDistance: 'खतरा दूरी',
    proximityThresholds: 'निकटता अलर्ट सीमाएं',
    triggerCaution: 'सावधानी स्थिति सीमा',
    triggerDanger: 'गंभीर टकराव अलर्ट सीमा',
    fieldOfView: 'प्रभावी सीमा: 2–80 सेमी (कोण: 15°)',

    // Log Categories
    catAll: 'सभी',
    catAlerts: 'अलर्ट्स',
    catWarnings: 'चेतावनियां',
    catSensors: 'सेंसर',
    catConnection: 'कनेक्शन',
    catCamera: 'कैमरा',
    catSystem: 'सिस्टम',

    // Sweeps & Diagnostics
    pauseSweep: 'रोकें',
    liveSweep: 'लाइव रेंज स्वीप',
    systemLink: 'सिस्टम लिंक',
    rangeSimulation: 'रेंज सिमुलेशन',
    technicalDiagnostics: 'तकनीकी डायग्नोस्टिक्स',
    simulateHazard: 'खतरा सिमुलेट करें',
    action: 'कार्रवाई',
    gasNormal: 'सामान्य',
    gasHigh: 'उच्च',
  },
};
