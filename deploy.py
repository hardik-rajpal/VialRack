from subprocess import Popen, PIPE
import subprocess,time
deploybranch = 'gh-pages'
p = Popen('git branch -D gh-pages'.split(), stdin=PIPE, stdout=PIPE, stderr=PIPE)
output,err = p.communicate()
p = Popen('git checkout -b gh-pages'.split(), stdin=PIPE, stdout=PIPE, stderr=PIPE)
output,err = p.communicate()
time.sleep(1)
subprocess.call(['bash','deploy.sh'])
subprocess.call(['bash','cachecleaner.sh'])
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
# Popen('ng deploy --base-href=/VialRack/ --no-silent'.split(), stdin=PIPE, stdout=PIPE, stderr=PIPE)
# output,err = p.communicate()
# p.wait()
# print(output)

# subprocess.call('bash final.sh'.split())

