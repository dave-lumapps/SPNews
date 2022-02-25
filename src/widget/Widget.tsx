import React, { useEffect, useMemo, useState, useContext, createContext } from 'react';
import { FormattedMessage, IntlProvider } from 'react-intl';
import {
    Chip,
    ChipGroup,
    ImageBlock,
    ImageBlockCaptionPosition,
    Notification,
    Kind,
    Size,
    Theme,
    AspectRatio,
    CommentBlock
} from '@lumx/react';

import { NotificationsProvider, PredefinedErrorBoundary, useLanguage, useNotifications } from 'lumapps-sdk-js';

import messagesEn from '../translations/en.json';
import messagesFr from '../translations/fr.json';

import defaultGlobalSettings from './defaultGlobalSettings';
import { isPlainObject, keys } from 'lodash';
import { mdiNewspaperVariantMultipleOutline } from '@lumx/icons';






type Widget = import('lumapps-sdk-js').ContentComponent<
    import('./types').SampleAppGlobalParams,
    import('./types').SampleAppParams
>;

const Widget: Widget = ({ value = {}, globalValue = {}, theme = Theme.light }) => {
    const [url, setUrl] = useState<string | undefined>();
    const [error, setError] = useState<string>();

    const { sited, nonewsId, useGreyScale, useBlur, blur, pages, interest, news, siteurl, excerpt,nonews, useimage, baseurl, domain }: any = value;
    const [testy, setTesty] = useState('');
    
    const { baseUrl = defaultGlobalSettings.baseUrl }: any = globalValue;
    console.log("********************* WIDGET : " + news)
    console.log("********************* PAGES : " + pages)
    console.log("********************* EXCERPT : " + excerpt)
    console.log("********************* NONEWS : " + nonews)
    console.log("********************* SITEURL : " + siteurl
    )

if(news !== undefined)
{
    //setTesty(news)
}
    

    useEffect(() => {
      
        const size = 1200;
        let link = baseUrl;
        link = nonewsId && nonewsId !== '' ? `${link}id/${nonewsId}/${size}` : `${link}${size}`;
        link = useGreyScale ? `${link}?grayscale` : link;
        // eslint-disable-next-line no-nested-ternary
        link = useBlur && useGreyScale ? `${link}&blur` : useBlur ? `${link}?blur` : link;
        link = useBlur && blur !== '' && blur !== undefined ? `${link}=${blur}` : link;

        setUrl(link);
    }, [blur, nonewsId, useBlur, useGreyScale, url, baseUrl]);

   // console.log("___________CURRENT NEWS  : " + JSON.stringify(news))
    

    function GetNews (news:any):JSX.Element  {
        
        
       // console.log("___________GETTING NEWS  : " + JSON.stringify(news))
         news = JSON.stringify(news);
        
      
        
            // if(news !== undefined)
             {
             //console.log("_____________CALLING PAGES API : ")
             return(
                 
                    <CommentBlock
    hasActions
    isRelevant
    avatarProps={{ image: 'https://hypertecdirect.com/wp-content/uploads/SharePoint-Logo.wine_.png', alt: 'Avatar' }}
    date=""
    name="newsone"
    text={news}
   
/>
                
             )
             
           
         }
         
     }
     interface LooseObject {
         img:string;
        id: string;
        title: string;
        published:string;
        url: string;
        author:string;
        excerpt:string;
        class:string;
        level:string;
        version:string;
        listid:string;
    
    
    }
 //   console.log("___________NEWS 1 " + JSON.stringify(news))
    const [list, setList] = useState([]);
   

 function createImgUrl(url: any)
 {
     //get list id
     //get item id
     //call the graph api
     //https://graph.microsoft.com/v1.0/sites/cordapse.sharepoint.com:/sites/TheHub:/lists/82C0AD37-3D97-499B-A437-68B548CAA8C6/items/5/driveItem/thumbnails/0/large
     //bring back the response.url

     var newUrl = "";
     console.log("22222222222222222222222 SITE URL " + url)
     var temp1 = url.replace("sites", "_api/v2.0/sharepoint:/sites")
     console.log("33333333333333333333333 temp " + temp1)
     var temp2 = temp1 + ":/driveItem/thumbnails/0/c200x200/content?preferNoRedirect=true"
     console.log("44444444444444444444444444 temp " + temp2)
     newUrl = temp2
     return newUrl;
 }

    function ListPagesTest(res:any) { 
   //     console.log("___________TYPE OF TEST" + typeof(res))
        console.log("_______LISTING PAGES " + JSON.stringify(res))
    
        let list = new Array;
    
        
        if(res)
        {
        Object.keys(res.value).forEach(key => {
        //    console.log(key, res.value[key]);

            var str;
            var obj={} as LooseObject;
            console.log("stat of use image : " + useimage)
            
           

            obj.id = res.value[key].id;
            obj.title = res.value[key].title;
            obj.published = res.value[key].lastModifiedDateTime;
            obj.url = siteurl +"/"+ res.value[key].webUrl;
            
            obj.img = createImgUrl(siteurl +"/"+ res.value[key].webUrl)
            obj.author = res.value[key].createdBy.user.displayName;
            obj.level = res.value[key].publishingState.level;
            obj.version = res.value[key].publishingState.versionId;
            
            if(useimage === true)
            {
                obj.img = "https://i0.wp.com/office365itpros.com/wp-content/uploads/2019/02/Sharepoint365NewIcon.png"
                obj.class = "hasimage"
            }
            
           
           

            
            
            if(res.value[key].webParts[0].type = "rte")
            {
             
           // obj.excerpt = res.value[key].webParts[0].data;
           str = res.value[key].webParts[0].data.innerHTML;
       //    console.log("STRING " + str)
           if(str != undefined)
           {
           str = str.substring(0,excerpt)
           }
           if(str == undefined)
           {
           str = "<p></p>"
           }
           obj.excerpt = str;


            }
            list.push(obj)
            

          });
        }
        //console.log(JSON.stringify(list))
        if(res)
    {

        // this is where we set the number of news items
        list = list.slice(0,nonews);
    return(
       <div className='newsContainer'>
        {list.length > 0
                    ? list.map((nws) => (
                        
                        <div className="newsItem">
                            <div className="newsTitle">
                            <a target="_blank" className="url" href={nws.url}>{nws.title}</a>
                        </div>
                        <div className="newsImage">
                            
                        <img src={nws.img} className={nws.class}></img>
                        
                        </div>
                        <div className="excerpt">
                        <div dangerouslySetInnerHTML={{__html: nws.excerpt}} />
                        </div>
                        
                        <div className="newsPub">
                        <Chip size={Size.s} theme={theme}>
                        {new Intl.DateTimeFormat("en-GB", {
                         year: "numeric",
                         month: "long",
                         day: "2-digit"
                        }).format(new Date(nws.published))}

                       
                        </Chip>
                        
                        </div>
                        <div className="chips">
                        <div className="author">
                        <Chip size={Size.s} theme={theme}>{nws.author}</Chip>
                        
                        </div>
                        <div className="published">
                        <Chip size={Size.s} theme={theme}>{nws.level}</Chip>
                        
                        </div>
                        <div className="version">
                        <Chip size={Size.s} theme={theme}>{nws.version}</Chip>
                        
                        </div>
                        </div>
                        
                        </div>
                       
                          
                      ))
                      : [
                        
                    ]}
                   
                      </div>
         
           
    );
                    }
                    else
                    return(<div>News item will appear here</div>)
    }

    
   
   
const z = ListPagesTest(news)

    useEffect(() => {
        
    }, []);
    return (
       
        <div className="widget-picsum">
             
             {z}
            {error && (
                <Notification
                    theme={theme}
                    type={Kind.error}
                    content={<FormattedMessage id="errors.retrieve_user" />}
                    isOpen
                    actionLabel="Dismiss"
                    onActionClick={() => setError(undefined)}
                />
            )}
           
        </div>
    );
};


const NotificationAwareWidget: Widget = (props) => {
    const { displayLanguage } = useLanguage();
    const messages: Record<string, Record<string, string>> = {
        en: messagesEn,
        fr: messagesFr,
    };
    const lang = useMemo(() => (Object.keys(messages).includes(displayLanguage) ? displayLanguage : 'en'), [
        displayLanguage,
        messages,
    ]);

    return (
        <IntlProvider locale={lang} messages={messages[lang]}>
            <NotificationsProvider>
                <PredefinedErrorBoundary>
                    <Widget {...props} />
                </PredefinedErrorBoundary>
            </NotificationsProvider>
        </IntlProvider>
    );
};

export { NotificationAwareWidget as Widget };
