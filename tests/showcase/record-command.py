"""Run one bounded local validation and preserve its actual output and exit."""
import os, subprocess, sys, time, shlex, signal
log, *command = sys.argv[1:]
env = dict(os.environ, NO_COLOR='1')
env.pop('FORCE_COLOR', None)
env['PATH'] = '/Users/calebbolden/.nvm/versions/node/v22.21.0/bin:' + env['PATH']
with open(log, 'w') as stream:
    stream.write('CWD ' + os.getcwd() + '\nCOMMAND ' + shlex.join(command) + '\n')
    stream.flush()
    start = time.monotonic()
    try:
        child = subprocess.Popen(command, stdout=stream, stderr=subprocess.STDOUT, env=env, start_new_session=True)
        code = child.wait(timeout=290)
    except subprocess.TimeoutExpired:
        os.killpg(child.pid, signal.SIGTERM)
        try:
            child.wait(timeout=5)
        except subprocess.TimeoutExpired:
            os.killpg(child.pid, signal.SIGKILL)
            child.wait(timeout=3)
        code = 124
    stream.write(f'\nEXIT {code}\nELAPSED {time.monotonic()-start:.3f}s\n')
print(log + ': exit ' + str(code))
sys.exit(code)
