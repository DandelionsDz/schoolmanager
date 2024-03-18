while [ 1 ]
do
    echo start commit;
    echo $(date +%s) new function for web app > README.md;
    git add . && git commit -m "$(date +%s)" && git push;
    sleep 900;
done
