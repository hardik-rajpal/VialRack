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
for fpath in ctnt:
    path = 'src/'+fpath.split('./')[1]
    print(path)
    file = open(path,'r')
    styles = file.read()
    # print(styles)
    styles = styles.replace('/assets/','/VialRack/assets/')
    # styles = styles.replace('/VialRack/assets/','/assets/')
    # print(styles)
    file.close()
    file = open(path,'w')
    file.write(styles)
# Popen('ng deploy --base-href=/VialRack/ --no-silent'.split(),stderr=PIPE,stdout=PIPE)
# subprocess.call('bash final.sh'.split())

