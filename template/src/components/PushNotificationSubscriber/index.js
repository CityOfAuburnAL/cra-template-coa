const { useState, useEffect } = require("react");

/* eslint-disable max-len */
const applicationServerPublicKey = 'BEkWqEJJech8xX2Pyzj1vuTXkyzXB1udosgXlr-1iKgUfkfljb_-REfxzMt6iNVywjX49eYqCczh53NK5BzrPjM';
/* eslint-enable max-len */

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function usePushNotification() {
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        // TODO: I removed all those checks but I should still probably set a message or something for if the browser doesn't support Push Notification
        if ('PushManager' in window) {
            // Can't do this inside serviceWorker.js because that loads after our page first loads
            navigator.serviceWorker.ready.then((swRegistration) => {
                // Once we have a service worker ready we can check for active push subscriptions
                return swRegistration && swRegistration.pushManager.getSubscription()
                    .then((subscription) => {
                        // If we have an active subscription we should set the Settings toggle as well as update our database with the latest subscription ID
                        setIsSubscribed(!!subscription);
                        // TODO: Add update method to API
                        updateSubscriptionOnServer(subscription);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            });
        }
    },[])

    const updateSubscriptionOnServer = (subscription) => {
        if (subscription) {
            //I don't know what kind of wacky object PushSubscription is but this is how to get data...
            subscription = JSON.parse(JSON.stringify(subscription));
            let data = {
                // Email: this.props.user.Email,
                Name: 'My Library',
                Endpoint: subscription.endpoint,
                Keys_p256dh: subscription.keys.p256dh,
                Keys_auth: subscription.keys.auth
            };

            return fetch(`https://api2.auburnalabama.org/notification/subscribe`, { method: "POST", body: JSON.stringify(data), headers: { "Content-Type" : "application/json" } })
                .then((response) => {
                    //updates the button/switch
                    // TODO: maybe look at this but right now I need a "PUT" method, I'm just posting and it fails if the endpoint is already registered
                    //this.setState({ AppPushNotifications: response.ok });
                    //TODO: handle !response.ok
                })
                .catch((error) => {
                    console.error(error);
                    //TODO: handle error
                });
        }
    }

    const removeSubscriptionOnServer = subscription => {
        //I don't know what kind of wacky object PushSubscription is but this is how to get data...
        subscription = JSON.parse(JSON.stringify(subscription));
        // TODO: Right now API can only delete by ID but I need to delete by endpoint... this also means a big change
        fetch(`https://api2.auburnalabama.org/notification/endpoint/${subscription.endpoint}`, { method: 'DELETE' })
            .then((response) => {
                //update the button/switch to reflect that the subscription was removed/delete
                // TODO: maybe look at this but right now I need a "DELETE" method that works for endpoints, I'm just letting them pile up in the database
                // this.setState({ AppPushNotifications: !response.ok });
                //TODO: handle !response.ok
            })
            .catch((error) => {
                console.error(error);
                //TODO: handle error
            });
    }

    const handleSubscribeNotifications = () => {
        const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
        if ('PushManager' in window) {
            // Can't do this inside serviceWorker.js because that loads after our page first loads
            navigator.serviceWorker.ready.then((swRegistration) => {
                swRegistration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: applicationServerKey
                })
                .then((subscription) => {
                    setIsSubscribed(true);
                    return updateSubscriptionOnServer(subscription);
                })
                .catch(function(err) {
                    console.log('Failed to subscribe the user: ', err);
                });
            })
        }
    }

    const handleUnsubsribeNotifications = () => {
        navigator.serviceWorker.ready.then((swRegistration) => {
            swRegistration.pushManager.getSubscription().then((subscription) => {
                subscription.unsubscribe().then((successful) => {
                    removeSubscriptionOnServer(subscription);
                }).catch(() => {
                    removeSubscriptionOnServer(subscription);
                });
                setIsSubscribed(false);
            });
        });
    }

    const togglePushNotifications = () => {
        if (!('PushManager' in window)) {
            alert('Push Notifications are not supported on your browser.');
            setIsSubscribed(false);
            return;
        }
        
        //TODO: Make sure that form load doesn't register/unregister
        if (!isSubscribed) {
            handleSubscribeNotifications();
        } else {
            handleUnsubsribeNotifications();
        }
    }

    return [isSubscribed, togglePushNotifications];
}

export default usePushNotification;