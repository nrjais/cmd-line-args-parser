files=0
touch report.txt
for file in $(ls $1/*.js); do
  echo "Running =======> $file\n"
  node runTest.js "$file"
  ((files++))
  echo
done

total=0
failed=0

for t in $(awk -F, '{print $1}' report.txt); do
((total+=t))
done

for t in $(awk -F, '{print $2}' report.txt); do
((failed+=t))
done

((passed=total-failed))
rm report.txt
nc='\033[0m'
red='\033[0;31m'
green='\033[0;32m'
echo "${green}Total $files test files ran${nc}"
echo "${red}Total $passed of $total Passed${nc}"
