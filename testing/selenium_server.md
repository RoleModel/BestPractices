## Selenium Server Setup and Testing

Using Selenium Server and a guest virtual machine requires a lot of setup and configuration. The following sections describe the configuration and test execution process when using Selenium Server.

### VirtualBox and Virtual Machine Setup

The following steps describe the process for configuring an Internet Explorer 9 and Windows 7 VM provided by Microsoft.

1. [Download a virtual machine](https://developer.microsoft.com/en-us/microsoft-edge/tools/vms/) from Microsoft by selecting 'IE9 on Win7' with 'VirtualBox' as the platform.

2. Import the virtual machine with VirtualBox.

3. Configure your VirtualBox preferences host-only adapter.
    ![](/testing/virtualbox_hostonly.png)

    ![](/testing/virtualbox_hostonly_config.png)

4. Change the virtual machine network configuration.
    ![](/testing/guest_machine_adapter_1.png)

    ![](/testing/guest_machine_adapter_2.png)

5. Boot the virtual machine.

6. Setup Selenium Server on the virtual machine.
    - Create the directory `C:\selenium`
    - Download the latest version of Java
    - Download the `selenium-server-standalone-2.53.1.jar` from [here](http://selenium-release.storage.googleapis.com/index.html?path=2.53/) and extract it to `C:\selenium`
    - Download the `IEDriver` from [here](http://www.seleniumhq.org/download/) and extract it to `C:\selenium`
    - Modify your `%PATH%` to include `C:\selenium`

    ![](/testing/windows_path.png)

7. Configure port-forwarding on the virtual machine.
    - Open PowerShell running as an Administrator
    - Run this command
        * `listenaddress` represents the `SELENIUM_SERVER_APP_DOMAIN`, generally `localhost`
        * `listenport` represents the port you expose using Selenium Server
        * `connectaddress` represents the host IP address (our host-only adapter IP address)
        * `connectport` represents the `SELENIUM_SERVER_APP_PORT`
          ```bash
          $ netsh interface portproxy add v4tov4 listenport=3001 listenaddress=localhost connectport=3001 connectaddress=10.100.1.1
          ```

    ![](/testing/windows_portforward_config.png)

8. Disable Windows Firewall on all profiles.

    ![](/testing/windows_firewall.png)

9. In Windows Network and Sharing Center, configure the Local network settings.

    ![](/testing/windows_local_network.png)

10. Verify the machines are connected by pinging the guest virtual machine
    - From your computer
        ```bash
        $ ping 10.100.1.2
        ```
    - From the Windows VM
        ```bash
        $ ping 10.100.1.1
        ```

### Setting Up and Starting Selenium Server

The following steps are for a macOS/OSX host running a Windows 7 guest with Internet Explorer 9.

1. Install `selenium-server`
  ```bash
  $ brew install selenium-server
  ```

2. In a bash window, start a `selenium-server` hub
  ```bash
  $ selenium-server -role hub
  ```

3. In a CMD window on the virtual machine, start a `selenium-server` node:
  ```bash
  $ java -jar C:\selenium\selenium-server-standalone-2.53.1.jar -role node -hub http://10.100.1.1:4444/grid/register  -maxSession 15 -browser browserName="internet explorer",version=ANY,platform=WINDOWS,maxInstances=5 -Dwebdriver=C:\selenium\IEDriverServer.exe -port 5556
  ```
