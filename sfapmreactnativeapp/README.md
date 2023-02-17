# SnappyFlow Reactnativeapp

Setting up the development environment
======================================
Installing dependencies
-----------------------

You will need Node, the React Native command line interface, a JDK, and Android Studio.

While you can use any editor of your choice to develop your app, you will need to install Android Studio in order to set up the necessary tooling to build your React Native app for Android.

### Node, JDK

We recommend installing Node via [Chocolatey](https://chocolatey.org), a popular package manager for Windows.

It is recommended to use an LTS version of Node. If you want to be able to switch between different versions, you might want to install Node via [nvm-windows](https://github.com/coreybutler/nvm-windows), a Node version manager for Windows.

React Native also requires [Java SE Development Kit (JDK)](https://openjdk.java.net/projects/jdk/19/), which can be installed using Chocolatey as well.

Open an Administrator Command Prompt (right click Command Prompt and select "Run as Administrator"), then run the following command:

    choco install -y nodejs-lts microsoft-openjdk19

If you have already installed Node on your system, make sure it is Node 16 or newer. If you already have a JDK on your system, we recommend JDK19. You may encounter problems using lower JDK versions.

> You can find additional installation options on [Node's Downloads page](https://nodejs.org/en/download/).

### Android development environment

Setting up your development environment can be somewhat tedious if you're new to Android development. If you're already familiar with Android development, there are a few things you may need to configure. In either case, please make sure to carefully follow the next few steps.

#### 1\. Install Android Studio

[Download and install Android Studio](https://developer.android.com/studio/index.html). While on Android Studio installation wizard, make sure the boxes next to all of the following items are checked:

*   `Android SDK`
*   `Android SDK Platform`
*   `Android Virtual Device`
*   If you are not already using Hyper-V: `Performance (Intel ® HAXM)` ([See here for AMD or Hyper-V](https://android-developers.googleblog.com/2018/07/android-emulator-amd-processor-hyper-v.html))

Then, click "Next" to install all of these components.

> If the checkboxes are grayed out, you will have a chance to install these components later on.

Once setup has finalized and you're presented with the Welcome screen, proceed to the next step.

#### 2\. Install the Android SDK

Android Studio installs the latest Android SDK by default. Building a React Native app with native code, however, requires the `Android 12 (S)` SDK in particular. Additional Android SDKs can be installed through the SDK Manager in Android Studio.

To do that, open Android Studio, click on "More Actions" button and select "SDK Manager".

> The SDK Manager can also be found within the Android Studio "Preferences" dialog, under **Appearance & Behavior** → **System Settings** → **Android SDK**.

Select the "SDK Platforms" tab from within the SDK Manager, then check the box next to "Show Package Details" in the bottom right corner. Look for and expand the `Android 12 (S)` entry, then make sure the following items are checked:

*   `Android SDK Platform 31`
*   `Intel x86 Atom_64 System Image` or `Google APIs Intel x86 Atom System Image`

Next, select the "SDK Tools" tab and check the box next to "Show Package Details" here as well. Look for and expand the `Android SDK Build-Tools` entry, then make sure that `31.0.0` is selected.

Finally, click "Apply" to download and install the Android SDK and related build tools.

#### 3\. Configure the ANDROID\_HOME environment variable

The React Native tools require some environment variables to be set up in order to build apps with native code.

1.  Open the **Windows Control Panel.**
2.  Click on **User Accounts,** then click **User Accounts** again
3.  Click on **Change my environment variables**
4.  Click on **New...** to create a new `ANDROID_HOME` user variable that points to the path to your Android SDK:


The SDK is installed, by default, at the following location:

    %LOCALAPPDATA%\Android\Sdk
    eg. C:\Users\suraj.gupta\AppData\Local\Android\Sdk

You can find the actual location of the SDK in the Android Studio "Settings" dialog, under **Appearance & Behavior** → **System Settings** → **Android SDK**.

Open a new Command Prompt window to ensure the new environment variable is loaded before proceeding to the next step.

1.  Open powershell
2.  Copy and paste **Get-ChildItem -Path Env:\\** into powershell
3.  Verify `ANDROID_HOME` has been added
4.  If not , please restart your system to see the changes.

#### 4\. Add platform-tools to Path

1.  Open the **Windows Control Panel.**
2.  Click on **User Accounts,** then click **User Accounts** again
3.  Click on **Change my environment variables**
4.  Select the **Path** variable.
5.  Click **Edit.**
6.  Click **New** and add the path to platform-tools to the list.

The default location for this folder is:

    %LOCALAPPDATA%\Android\Sdk\platform-tools
    eg. C:\Users\suraj.gupta\AppData\Local\Android\Sdk\platform-tools


Running your React Native application on your physical device
-------------------------------------

### Step 1:Enable Debugging over USB
To enable USB debugging on your device, you will first need to enable the "Developer options" menu by going to Settings → About phone → Software information and        then tapping the Build number row at the bottom seven times. You can then go back to Settings → Developer options to enable "USB debugging".
    
### Step 2. Plug in your device via USB[​](#2-plug-in-your-device-via-usb-1 "Direct link to heading")

Let's now set up an Android device to run our React Native projects. Go ahead and plug in your device via USB to your development machine.

Now check that your device is properly connecting to ADB, the Android Debug Bridge, by running `adb devices`.

    $ adb devices
    List of devices attached
    emulator-5554 offline   # Google emulator
    14ed2fcc device         # Physical device

Seeing `device` in the right column means the device is connected. You must have **only one device connected** at a time.
    



### Step 3: Start your application

Open a new terminal inside your React Native project folder (make sure your phone is connected via usb). Run the following:

    npx react-native run-android

If everything is set up correctly, you should see your new app running in your device shortly.

`npx react-native run-android` is one way to run your app - you can also run it directly from within Android Studio.

> If you can't get this to work, please contact me.

### That's it!

Congratulations! You've successfully run the app on your device


### RUM Configuration

Please open src/app.js in the root directory of the app


### To share the screen of your physical device to customers

download the screen stream apk from the android playstore.

Thanks!!
