let the_big_string = `#!/bin/bash
cd
cd desktop/project/frame
#cd projects/my-vueapp
x=\`git pull\` && if [[ "$x" == *"erge conflict"* ]]; then
         echo "there's a merge conflict, contact Josh for assistance"
    elif [[ "$x" == *"Already up to date"* ]]; then
        echo "You already have the latest updates" 
    elif [[ "$x" == *"lease commit your changes or stash them before you merge"* ]]; then
        echo "attempting to add and commit"
        git add .
        git commit -m "from update script"
        ./update.sh   
    elif [[ "$x" == *""* ]]; then
	echo "$x"$'\n'$'\n'
	echo "Updating the app, please wait around 2 minutes"
	echo $'\n'$'\n'
    #export PATH=$PATH:/anaconda2/bin:/opt/local/bin:/opt/local/sbin:/Library/Frameworks/Python.framework/Versions/3.5/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Library/TeX/texbin:/usr/local/share/dotnet:/Library/Frameworks/Mono.framework/Versions/Current/Commands:/Applications/Xamarin
    export PATH=$PATH:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
    { #try
        npm run electron:build
    } || { #catch
        echo "npm run build electron:build has failed"
    }
    fi
`;
export default{
    the_big_string
}