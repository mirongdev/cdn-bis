   const getUrlProtocol = window.location.protocol;
    const getUrlHost = window.location.host;
    const getUrlHostName = window.location.hostname;
    const getUrlPathName = window.location.pathname;
    const getUrlSearch = window.location.search;

const getinfo=(`
   protocol: ${getUrlProtocol}\n
   Host: ${getUrlHost}\n
   HostName: ${getUrlHostName}\n
   PathName: ${getUrlPathName}\n
   Search: ${getUrlSearch}\n
   `);

    const getLink = window.location.href;
    const urlObj = new URL(getLink);
    // Ambil nama file terakhir dari path
    const getLinkFileName = urlObj.pathname.split('/').pop();
    // Ambil seluruh path kecuali domain
    const getLinkFullPath = urlObj.pathname.substring(1); // Menghapus leading "/"
    // Gunakan URLSearchParams untuk mengambil parameter query
    const getLinkParams = new URLSearchParams(urlObj.search);
    // Ambil nilai dari parameter "data"
    const getLinkValueData = getLinkParams.get('data');
    console.log(`
   Link: ${getLink}\n   
   FileName: ${getLinkFileName}\n 
   Fullpath: ${getLinkFullPath}\n
   Params: ${getLinkParams}\n  
   Value Of Data: ${getLinkValueData}\n  
   `);
   
   alert(getinfo);