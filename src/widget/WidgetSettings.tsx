import React, { useMemo, useState, useEffect, useContext, createContext } from 'react';
import { FormattedMessage, IntlProvider, useIntl } from 'react-intl';
import { Dropdown, Slider, Switch, TextField, List, ListItem, Size, Button,CommentBlock } from '@lumx/react';
import { PredefinedErrorBoundary, useDebounce, useExportProps, useLanguage } from 'lumapps-sdk-js';

import messagesEn from '../translations/en.json';
import messagesFr from '../translations/fr.json';

import '../style/App.css';

import axios from 'axios';
import {retarray} from '../hooks/helper'

import { mdiConsolidate, mdiDoNotDisturbOff } from '@mdi/js';


type WidgetSettings = import('lumapps-sdk-js').SettingsComponent<
    import('./types').SampleAppGlobalParams,
    import('./types').SampleAppParams
    
>;

const WithIntlSettings: WidgetSettings = ({ properties = {}, exportProp }) => {
    const intl = useIntl();
    
    const [siteId, setSiteId] = useState(properties.siteId);
    const [siteName, setSiteName] = useState(properties.siteName);
    const [siteDesc, setSiteDesc] = useState(properties.siteDesc);
    const [siteSearch, setSiteSearch] = useState(properties.siteSearch);
    const [sites, setSites] = useState(properties.sites);
    const [url, setSiteURL] = useState('');

    const [interest, setInterest] = useState('');
    const [response, setResponse] = useState('');
    const [pages, setPages] = useState('');
    const [excerpt, setExcerpt] = useState(properties.excerpt || 1);
    const [nonews, setNonews] = useState(properties.nonews || 1);

    const [useimage, setUseImage] = useState<boolean>(properties.useimage || false);
    
    


    const [nonewsId, setNonewsId] = useState(properties.nonewsId);
    const [useGreyScale, setUseGreyScale] = useState<boolean>(properties.useGreyScale || false);
    const [useBlur, setUseBlur] = useState<boolean>(properties.useBlur || false);
    const [blur, setBlur] = useState(properties.blur || 1);

    const debouncedImageId = useDebounce(nonewsId, 800);

    useExportProps(debouncedImageId, 'nonewsId', properties, exportProp);
    useExportProps(useGreyScale, 'useGreyScale', properties, exportProp);
    useExportProps(useBlur, 'useBlur', properties, exportProp);
    useExportProps(blur, 'blur', properties, exportProp);

    useExportProps(pages, 'news', properties, exportProp);
    useExportProps(sites, 'foundsites', properties, exportProp);
    useExportProps(url, 'siteurl', properties, exportProp);
    useExportProps(excerpt, 'excerpt', properties, exportProp);
    useExportProps(nonews, 'nonews', properties, exportProp);
    useExportProps(useimage, 'useimage', properties, exportProp);


    const anchorSimpleRef = React.useRef(null);
    const [isSimpleOpen, setSimpleIsOpen] = React.useState(false);
    
    const toggleSimpleMenu = () => setSimpleIsOpen(!isSimpleOpen);
    const closeSimpleMenu = () => setSimpleIsOpen(false);

    const [showDDL, setDDL] = useState(false);
    const [showComm, setComments] = useState(false);
    const [showSlide, setSlider] = useState(false);
    const [showNonewsSlide, setNonewsSlider] = useState(false);
    const [showImageSwitch, setUseImageSwitch] = useState(false);


    console.log('_________________%%%%%%%% selected pages', pages);
   
   
    
console.log("SEARCH " + siteSearch)
     const onSimpleMenuSelected = (item: string, site:string, url:string) => () => {
       // console.log('_________________%%%%%%%% selected item', item);
      //  console.log('_________________%%%%%%%% selected site', site);
       
        
        setSiteId(item);
        setSiteName(site);
        setSiteDesc("You have selected the site: " + site +". Only modern sites will display news items. Please ensure you have selected a modern site using news site pages")
        setComments(true)
        setSiteURL(url)
        closeSimpleMenu();
    };
//______________________________________________________________________________________


interface LooseObject {
    siteName: string;
    siteID: string;
}
interface LooseObject2{
    newsTitle: string;
    newsUrl: string;
    newsDate : string;
    newsId: string;
}



function searchButton(res:any):JSX.Element { 
    if(showDDL)
    {
    return(
<div className="searchcontainer">         
<Button ref={anchorSimpleRef} onClick={toggleSimpleMenu}  disabled={interest === ""}>
   
               Choose SharePoint Site
            </Button>
</div>
    )
}
else
return(<div></div>)
}
          
interface LooseObject {
    id: string;
    title: string;
    published:string;
    url: string;


}
interface LooseObject2 {
    id: string;
    title: string;
    published:string;
    url: string;


}


function listSites(res:any):JSX.Element { 
  //  console.log("______LIST SITES JSON " + JSON.stringify(res))
    let list1 = new Array;
  //  console.log("___________TYPE OF RES " + typeof(res))

    for (var i=0; i<res.length; i++) {
        //console.log(res[i].id);
        //console.log(res[i].displayName);
        var obj={} as LooseObject;
        obj.siteName = res[i].displayName;
        obj.siteID = res[i].id;
        obj.url = res[i].webUrl;
        list1.push(obj)
       // console.log("_____LS __ " + obj.siteName + " " + obj.siteID)

    }
//console.log("______show ddl ? " + showDDL)
    if(showDDL)
    {
    return(
        <Dropdown isOpen={isSimpleOpen} onClose={closeSimpleMenu} anchorRef={anchorSimpleRef}>
    <List>
{list1.length > 0
                    ? list1.map((choice) => (
                          <ListItem
                              isSelected={siteId === choice.siteID}
                              key={choice.siteID}
                              onItemSelected={onSimpleMenuSelected(choice.siteID, choice.siteName, choice.url)}
                              size={Size.tiny}
                              value={choice.siteName}
                          >
                              
                              {choice.siteName}
                          </ListItem>
                      ))
                    : [
                          <ListItem key={0} size={Size.tiny}>
                              No data
                          </ListItem>,
                      ]}
            </List>
            </Dropdown>
           
    );
                    }
                    else
                    return(<div></div>)
                    
 } 

 function showComments():JSX.Element { 
    if(showComm)
    {
    return (
        
    <CommentBlock
    hasActions
    isRelevant
    avatarProps={{ image: 'https://hypertecdirect.com/wp-content/uploads/SharePoint-Logo.wine_.png', alt: 'Avatar' }}
    date=""
    name={siteName}
    text={siteDesc}
    visible={siteName === ""}
/>

    );
}
else
return(<div></div>)
 }
    //______________________________________________________________________________________       
    
    
   
    
  
  
  
    

    function GetPages (siteid:any) {
        
        
       // console.log("___________GETTING PAGES FOR SITE ID : " + JSON.stringify(siteid))
        siteid = JSON.stringify(siteid);
        
       
       
        const article = {        
            text: siteid,
                  
        };
     
        useEffect(() => {
           // If you want do do some other action after
           // the response is set do it here. This useEffect will only fire
           // when response changes.
           callYourAPIPages()
        }, [siteId]); // Makes the useEffect dependent on response.
     
        function callYourAPIPages() {
            //console.log("___CUURENT SITEID " + siteid)
            if(siteid !== undefined)
            {
            //console.log("_____________CALLING PAGES API : ")
            axios.post('https://dave-master-services.herokuapp.com/microsoft/getPages', article)
            .then(res =>  {
              // Handle Your response here.
              // Likely you may want to set some state
             // console.log("___________AXIOS START PAGES : ____________________")
              setPages(res.data);
             // console.log("________SETTING PAGES: " + JSON.stringify(res))

              var newRes = res.data.value
              console.log("NUMBER OF HITS " + newRes.length)

              let list1 = new Array;
              for (var i=0; i<newRes.length; i++) {
                console.log("CURRENT OF HITS " + i)
                //console.log(res[i].id);
                //console.log(res[i].displayName);
                var obj={} as LooseObject2;
                obj.id = newRes[i].id;
                obj.title = newRes[i].title;
                obj.published = newRes[i].lastModifiedDateTime;
                obj.url = newRes[i].webUrl;
                list1.push(obj)
              //  console.log("_____LS2 __ " + obj.id + " " + obj.title)
               // console.log("_____LS __ " + obj.siteName + " " + obj.siteID)
        
            }
          
            setSlider(true)
            setNonewsSlider(true)
           //   console.log("___________AXIOS END PAGES: ____________________")
              
           })
           .catch(err => {
            console.log(err)
          })
        };
    } // end if

    }

    
    
  function SearchSites (search:any) {
   // console.log("___________SS1 : " + search)
    const url = 'https://dave-master-services.herokuapp.com/microsoft/siteSearch'
   
    const article = {        
        text: search,
              
    };
 
    useEffect(() => {
       // If you want do do some other action after
       // the response is set do it here. This useEffect will only fire
       // when response changes.
    }, [interest]); // Makes the useEffect dependent on response.
 
    function callYourAPI() {
       // console.log("_____________CALLING API : ")
        axios.post('https://dave-master-services.herokuapp.com/microsoft/siteSearch', article)
        .then(res =>  {
          // Handle Your response here.
          // Likely you may want to set some state
        //  console.log("___________AXIOS START : ____________________")
          setResponse(res.data.value);
        //  console.log(res.data)
        //  console.log("___________AXIOS END : ____________________")
          setDDL(true)
         
       })
      
       .catch(err => {
        console.log(err)
      })
    };

    
 
    function HandleChange(event:any) {

       setInterest(event.target.value);
       
       
     //  console.log("___________HANDLE SITE SELECTION: " + event.target.value)
    };

    return (
        <div className="searchcontainer">
           <input
             className="searchInput"
             type="text"
             placeholder="Enter a site name"
             value={interest}
             onChange={HandleChange}
           />
           <Button
             onClick={() => callYourAPI()}
             className="searchbutton"
             // You may want to disable your button until interest is set
             disabled={interest === ""}
             
           >
             Search
           </Button>
        </div>
     );
  }; // end


  function showNonewsSlider(siteid:any):JSX.Element { 
    if(showDDL)
    {
      return (
  <Slider
                    label={(<FormattedMessage id="settings.nonews_value_title" />) as any}
                    helper={(<FormattedMessage id="settings.nonews_value_desc" />) as any}
                    max={20}
                    min={1}
                    value={nonews}
                    onChange={setNonews}
                />
      )
    }
    else
                    return(<div></div>)
  }

  function showSlider(siteid:any):JSX.Element { 
    if(showDDL)
    {
      return (
  <Slider
                    label={(<FormattedMessage id="settings.excerpt_value_title" />) as any}
                    helper={(<FormattedMessage id="settings.excerpt_value_desc" />) as any}
                    max={300}
                    min={10}
                    value={excerpt}
                    onChange={setExcerpt}
                    
                />
      )
    }
    else
                    return(<div></div>)
  }


  function showImage(siteid:any):JSX.Element { 
    if(showDDL)
    {
      return (
  <Switch className="mt+ ml" isChecked={useimage} onChange={() => setUseImage(!useimage)}>
                {intl.formatMessage({ id: 'settings.image' })}
            </Switch>
)
}
else
                return(<div></div>)
}

  const searchBox = SearchSites(interest);
  const searchBut = searchButton(interest);
  const  dropDown = listSites(response);
  const comments = showComments();
  const sitepages = GetPages(siteId);
  const nwsslider = showNonewsSlider(siteId);
  const slider = showSlider(siteId);
  const img = showImage(siteId);
  
 // const lp = ListPages(pages)
  
  

 // console.log("___________SEL DESC : ____________________" + siteDesc)
  
    return (
        <>

{searchBox}
{searchBut}
{dropDown}
{comments}
{sitepages} 
{nwsslider}
{slider}
{img}

            
            

            
        </>
    );
};

export const WidgetSettings: WidgetSettings = (props) => {
    //console.log("PROPS " + JSON.stringify(props))
    
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
            <PredefinedErrorBoundary>
                <WithIntlSettings {...props} />
            </PredefinedErrorBoundary>
        </IntlProvider>
    );
};
