chrome.extension.sendMessage({}, function(response) {
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);

            // ----------------------------------------------------------
            // This part of the script triggers when page is done loading
            let request = obj => {
                return new Promise((resolve, reject) => {
                    let xhr = new XMLHttpRequest();
                    xhr.open(obj.method || "GET", obj.url);
                    if (obj.headers) {
                        Object.keys(obj.headers).forEach(key => {
                            xhr.setRequestHeader(key, obj.headers[key]);
                        });
                    }
                    xhr.onload = () => {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            resolve(xhr.response);
                        } else {
                            reject(xhr.statusText);
                        }
                    };
                    xhr.onerror = () => reject(xhr.statusText);
                    xhr.send(obj.body);
                });
            };
            let buildEnvText = (accountId, userId, email) => {
              let env = (() => {
                switch (document.domain) {
                  case 'console-development.treasuredata.com':
                  case 'console-development-next.treasuredata.com':
                    return 'development aws';
                  case 'console-development.eu01.treasuredata.com':
                  case 'console-development-next.eu01.treasuredata.com':
                    return 'development eu01';

                  case 'console-staging.treasuredata.com':
                  case 'console-staging-next.treasuredata.com':
                    return 'staging aws';
                  case 'console-staging.treasuredata.co.jp':
                  case 'console-staging-next.treasuredata.co.jp':
                    return 'staging aws-tokyo';
                  case 'console-staging.eu01.treasuredata.com':
                  case 'console-staging-next.eu01.treasuredata.com':
                    return 'staging eu01';
                  case 'console-staging.ap02.treasuredata.com':
                  case 'console-staging-next.ap02.treasuredata.com':
                    return 'staging ap02';

                  case 'console.treasuredata.com':
                  case 'console-next.treasuredata.com':
                    return 'production aws';
                  case 'console.treasuredata.co.jp':
                  case 'console-next.treasuredata.co.jp':
                    return 'production aws-tokyo';
                  case 'console.eu01.treasuredata.com':
                  case 'console-next.eu01.treasuredata.com':
                    return 'production eu01';
                  case 'console.ap02.treasuredata.com':
                  case 'console-next.ap02.treasuredata.com':
                    return 'production ap02';
                }
              })();
              return `${env}:${accountId} - ${email}(${userId})`;
            };

            let render = (accountId, userId, email) => {
                let el = document.createElement('div');
                el.innerText = buildEnvText(accountId, userId, email);
                el.classList.add('which-td');
                document.body.appendChild(el);
            };

            request({"url":"/v4/users/current"}).then(data => {
                let user = JSON.parse(data);
                let regex = /(?<=\+)[A-z]*(?=@)/gm;
                // let accountName = email.match(regex)[0];
                request({"url":"/v4/account"}).then(data => {
                    let account = JSON.parse(data);
                    render(account.id, user.id, user.email);
                })
            });

        }
    }, 10);

});
