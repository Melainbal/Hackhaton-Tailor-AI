import torch
import psutil
import platform
import json
import os

try:
    import distro  # Needed for detailed Linux OS info
except ImportError:
    distro = None

def get_system_info():
    """Returns the system model name and OS distribution with category."""
    system_model = "Unknown"
    os_category = platform.system()

    try:
        if os_category == "Windows":
            import wmi
            computer = wmi.WMI()
            system_model = computer.Win32_ComputerSystem()[0].Model
            os_distribution = f"Windows {platform.version()}"
        elif os_category == "Linux":
            if os.path.exists("/sys/class/dmi/id/product_name"):
                system_model = os.popen("cat /sys/class/dmi/id/product_name").read().strip()
            if distro:
                os_distribution = f"Linux {distro.name()} {distro.version()}"
            else:
                os_distribution = f"Linux {platform.release()}"
        elif os_category == "Darwin":
            system_model = os.popen("sysctl -n hw.model").read().strip()
            mac_version = platform.mac_ver()[0]
            os_distribution = f"MacOS {mac_version} {platform.mac_ver()[1]}"
        else:
            os_distribution = "Unknown OS"
    except Exception:
        os_distribution = "Unknown OS"
    if system_model:
     return {
         "System Model": system_model,
         "OS_Distribution": os_distribution
     }
    else:
     return{"OS_Distribution": os_distribution}

def get_gpu_info():
    """Returns a list of GPUs with Manufacturer, Model, and GPU Memory."""
    gpus = []
    if torch.cuda.is_available():
        for i in range(torch.cuda.device_count()):
            gpu_name = torch.cuda.get_device_name(i)
            gpu_memory = torch.cuda.get_device_properties(i).total_memory / (1024 ** 3)  # Convert bytes to GB
            gpus.append({
                "Manufacturer": "NVIDIA",  # Assuming CUDA means NVIDIA
                "Model": gpu_name,
                "GPU Memory (GB)": round(gpu_memory, 2)
            })
    return gpus

def get_storage_info():
    """Returns a list of storage devices with their total capacity in GB."""
    storage_devices = []
    for partition in psutil.disk_partitions(all=False):
        if os.path.exists(partition.mountpoint):
            usage = psutil.disk_usage(partition.mountpoint)
            size = round(usage.total / (1024 ** 3), 2)
            if size > 1:
             storage_devices.append({
                 "Mountpoint": partition.mountpoint,
                 "File System": partition.fstype,
                 "Total Size (GB)": size
             })
    
    return storage_devices

def get_ram_info():
    """Returns total RAM in GB."""
    ram = psutil.virtual_memory().total / (1024 ** 3)  # Convert bytes to GB
    return round(ram, 2)

def get_cpu_info():
    """Returns a list of CPUs with architecture and whether they are virtual or physical."""
    cpu_list = []
    architecture = platform.machine()
    is_virtual = "Yes" if psutil.cpu_count(logical=True) > psutil.cpu_count(logical=False) else "No"
    
    cpu_list.append({
        "Architecture": architecture,
        "Virtual": is_virtual
    })
    return cpu_list

def main():
    """Gathers system details and returns them as JSON."""
    system_info = {
        # "System Model": get_system_model(),
        "System": get_system_info(),
        "GPUs": get_gpu_info(),
        "Storage (GB)": get_storage_info(),
        "Memory/System RAM (GB)": get_ram_info(),
        "CPUs": get_cpu_info()
    }
    
    # Convert to JSON
    print(json.dumps({"specs": system_info}))

if __name__ == "__main__":
 main()
 