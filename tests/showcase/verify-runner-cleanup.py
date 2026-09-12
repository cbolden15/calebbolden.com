"""Start the real standalone runner, send SIGTERM, and verify owned runtime removal."""
import subprocess, json, pathlib, urllib.request, time, socket
child=subprocess.Popen(['node','tests/showcase/run-standalone.mjs'],stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True)
try:
    record=json.loads(child.stdout.readline());print(json.dumps(record),flush=True)
    for attempt in range(100):
        try:
            with urllib.request.urlopen('http://localhost:3100/work/vora',timeout=1) as response: assert response.status==200
            break
        except OSError:time.sleep(.1)
    else:raise AssertionError('Runner did not become ready')
    child.terminate();output=child.communicate(timeout=15)[0];print(output)
    assert child.returncode==0
    assert not pathlib.Path(record['runtime']).exists()
    probe=socket.socket();assert probe.connect_ex(('localhost',3100))!=0;probe.close()
    print('SIGTERM exit 0; exact owned runtime removed; localhost3100 closed')
finally:
    if child.poll() is None:child.kill();child.wait(timeout=5)
