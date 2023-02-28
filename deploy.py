from subprocess import Popen, PIPE
import subprocess
deploybranch = 'gh-pages'
p = Popen(['git', 'branch', '--show-current'], stdin=PIPE, stdout=PIPE, stderr=PIPE)
output, err = p.communicate(b"input data that is passed to subprocess' stdin")
rc = p.returncode
output = output.decode('utf-8').strip()
if(output!=deploybranch):
    print('Not in deployment branch: ',deploybranch, '. Exiting...')
    exit()

subprocess.call(['bash','deploy.sh'])
with open('cssfiles.txt','r') as f:
    ctnt = f.read().splitlines()
    ctnt.pop()
for fpath in ctnt:
    with open(f'src/{fpath}','w+') as f:
        styles = f.read()
        styles = styles.replace('/assets/','/VialRack/assets/')
        f.write(styles)

