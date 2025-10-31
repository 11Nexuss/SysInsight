from flask import Flask, jsonify
from flask_cors import CORS
import psutil
import platform
import socket
from datetime import datetime
import json

app = Flask(__name__)

# More permissive CORS for development
CORS(app, resources={
    r"/api/*": {
        "origins": ["*"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

def serialize_value(val):
    """Convert any value to JSON-serializable type"""
    if val is None:
        return 0
    if isinstance(val, (int, float)):
        return float(val) if isinstance(val, float) else int(val)
    if isinstance(val, bool):
        return val
    if isinstance(val, str):
        return val
    return str(val)

def get_system_info():
    """Get comprehensive system information"""
    try:
        result = {}
        
        # System information
        try:
            print("DEBUG: Getting system info")
            result["system"] = {
                "platform": str(platform.system()),
                "platform_release": str(platform.release()),
                "platform_version": str(platform.version()),
                "hostname": str(socket.gethostname()),
                "boot_time": str(datetime.fromtimestamp(psutil.boot_time()).isoformat()),
                "uptime": int(datetime.now().timestamp() - psutil.boot_time())
            }
            print(f"DEBUG: system_info OK")
        except Exception as e:
            print(f"ERROR in system_info: {e}")
            result["system"] = {"error": str(e)}

        # CPU info
        try:
            print("DEBUG: Getting CPU info")
            cpu_percent = psutil.cpu_percent(interval=1)
            cpu_freq = psutil.cpu_freq()
            
            result["cpu"] = {
                "percent": serialize_value(cpu_percent),
                "cores": serialize_value(psutil.cpu_count(logical=False)),
                "logical_cores": serialize_value(psutil.cpu_count(logical=True)),
                "frequency": serialize_value(cpu_freq.current if cpu_freq else 0),
                "vendor": "Unknown",
                "model": str(platform.processor())
            }
            print(f"DEBUG: cpu_info OK - {result['cpu']}")
        except Exception as e:
            print(f"ERROR in cpu_info: {e}")
            result["cpu"] = {"error": str(e), "percent": 0}

        # Memory info
        try:
            print("DEBUG: Getting memory info")
            memory = psutil.virtual_memory()
            total_gb = float(memory.total) / (1024 ** 3)
            used_gb = float(memory.used) / (1024 ** 3)
            available_gb = float(memory.available) / (1024 ** 3)
            
            result["memory"] = {
                "percent": float(memory.percent),
                "total": float(round(total_gb, 2)),
                "used": float(round(used_gb, 2)),
                "available": float(round(available_gb, 2))
            }
            print(f"DEBUG: memory_info OK")
        except Exception as e:
            print(f"ERROR in memory_info: {e}")
            result["memory"] = {"error": str(e), "percent": 0}

        # Disk info
        try:
            print("DEBUG: Getting disk info")
            disk = psutil.disk_usage('/')
            total_gb = float(disk.total) / (1024 ** 3)
            used_gb = float(disk.used) / (1024 ** 3)
            free_gb = float(disk.free) / (1024 ** 3)
            
            result["disk"] = {
                "percent": float(disk.percent),
                "total": float(round(total_gb, 2)),
                "used": float(round(used_gb, 2)),
                "free": float(round(free_gb, 2))
            }
            print(f"DEBUG: disk_info OK")
        except Exception as e:
            print(f"ERROR in disk_info: {e}")
            result["disk"] = {"error": str(e), "percent": 0}

        # Process information
        try:
            print("DEBUG: Getting process info")
            processes = []
            for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
                try:
                    pid = proc.info.get('pid')
                    name = proc.info.get('name')
                    cpu_pct = proc.info.get('cpu_percent')
                    mem_pct = proc.info.get('memory_percent')
                    
                    if pid is not None and name is not None:
                        processes.append({
                            "pid": int(pid),
                            "name": str(name),
                            "cpu_percent": serialize_value(cpu_pct),
                            "memory_percent": serialize_value(mem_pct)
                        })
                except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                    pass
                except Exception as e:
                    print(f"DEBUG: Process error: {e}")
                    pass

            processes = sorted(processes, key=lambda x: x.get('cpu_percent', 0), reverse=True)[:10]
            result["processes"] = processes
            print(f"DEBUG: process_info OK - {len(processes)} processes")
        except Exception as e:
            print(f"ERROR in process_info: {e}")
            result["processes"] = []

        # Network connections
        try:
            print("DEBUG: Getting network info")
            network_connections = []
            for conn in psutil.net_connections(kind='inet'):
                try:
                    if conn.status == 'ESTABLISHED' and conn.raddr:
                        network_connections.append({
                            "local_address": f"{conn.laddr.ip}:{conn.laddr.port}",
                            "remote_address": f"{conn.raddr.ip}:{conn.raddr.port}",
                            "status": str(conn.status),
                            "pid": int(conn.pid) if conn.pid else 0
                        })
                except (AttributeError, ProcessLookupError, TypeError):
                    pass
                except Exception as e:
                    print(f"DEBUG: Network error: {e}")
                    pass

            result["network"] = network_connections[:10]
            print(f"DEBUG: network_info OK - {len(network_connections)} connections")
        except Exception as e:
            print(f"ERROR in network_info: {e}")
            result["network"] = []

        print(f"DEBUG: All info collected successfully")
        return result

    except Exception as e:
        print(f"ERROR in get_system_info: {e}")
        import traceback
        traceback.print_exc()
        return {"error": str(e)}

@app.route('/api/system', methods=['GET'])
def get_system_data():
    """Endpoint to get all system data"""
    try:
        data = get_system_info()
        return jsonify(data)
    except Exception as e:
        print(f"ERROR in get_system_data: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

if __name__ == '__main__':
    print("Starting SysInsight API server...")
    print("API will be available at: http://127.0.0.1:8000")
    print("Frontend should connect to: http://127.0.0.1:8000/api/system")
    app.run(debug=False, host='127.0.0.1', port=8000)