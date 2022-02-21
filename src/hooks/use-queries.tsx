import { useState, useEffect, useCallback } from 'react';
import '../style/App.css';
import axios from 'axios';
import React from 'react';
import defaultGlobalSettings from '../widget/defaultGlobalSettings';
import  baseUrl from '../widget/defaultGlobalSettings';
import { Lumapps, useCurrentUser, useContext, useRequest, useOrganization } from 'lumapps-sdk-js';
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
    PostBlock,
    UserBlock,
    List,
    ListItem,
    Avatar,
    Button,
    ListSubheader, 
    Table,
    TableBody,
    TableCell,
    TableCellVariant,
    TableHeader,
    TableHeaderProps,
    TableRow,
    ThOrder,
    Thumbnail,
    ThumbnailVariant,
    FlexBox,
    IconButton,
    Emphasis,
    Link,
    Orientation,
    Alignment,
    Typography,
    Color
   
    
    
} from '@lumx/react';
import { mdiCommentOutline, mdiDotsVertical, mdiInformationOutline, mdiHeart, mdiMessageTextOutline } from '@lumx/icons';
import orderBy from 'lodash/orderBy';


interface Title
{
    en:string;
   
}

interface RelevantCommentDetails
{
    text:string;
    en:string;
   
}

interface AuthorDetails {
    id:string;
    apiProfile:string;
    name:Name;
    profilePictureUrl:string;
    
  }
  interface Name
{
    fullName:string;
   
}
  

  interface Content {
    id: string;
    type: string;
    author:string;
    comments:string;
    likes: string;
    title: {
        [key: string]: Title
    }
    authorDetails: {
        [key: string]: AuthorDetails
    }
    name: {
        [key: string]: Name
    }
    url: string;
    fullName: string

    relevantCommentDetails: {
        [key: string]: RelevantCommentDetails
    }
    
    
   
    
    
   
  }

  
  
  
  
  export function GetSites(search:string | undefined = 'nowt')
  {

    
      
      console.log("______GETTING SITES " + search)
    const [contents, setContent] = useState<Content[]>([]);

    const article = {
        
        text: search,
              
    };
    console.log("______GETTING SITES QS " + article.text)

    useEffect(() => {
        if(search !== "nowt")
        {
        getAllSites()
        }

    },[]);


    const getAllSites = () => {
        console.log("______GETTING SITES AXIOS ")
        axios.post('https://dave-master-services.herokuapp.com/microsoft/siteSearch', article)
         .then(res => {
             
             console.log("___________AXIOS  : ____________________")

            
             setContent(res.data)
             console.log("LUM SEARCH RESULTS " + JSON.stringify(res.data))
             console.log(contents)
           })
           
           .catch(err => {
             console.log(err)
           })
   
           return(
            contents
        )
}
  }



  export const GetLumContent = (showUnanswered:boolean, noResults:boolean, resNo:string) => {
    
     console.log("SHOW UNANSWERED PARAM: " + showUnanswered)
     console.log("SHOW RESULTS MORE PARAM: " + noResults)
     console.log("SHOW NO OF RESULTS PARAM: " + resNo)
   
    const { email, fullName, thumbnailPhotoUrl, token } = useCurrentUser();
    const [contents, setContent] = useState<Content[]>([]);
    var newRes = parseInt(resNo);
    newRes = newRes+2
    
   
     useEffect(() => {

       
        
        

        const article = {
            body:
            {
            'lang': 'en',
            'tok': token,
            'maxResults': '50'
            },
            headers: { 
                'Content-Type': 'application/json'
                
            }
        }
       
         axios.post('https://dave-master-services.herokuapp.com/lum/content/posts', article)
         .then(res => {
             //console.log("LUMAPPS CONTENT REQUEST " + JSON.stringify(res))
             console.log("___________AXIOS  : ____________________")
             setContent(res.data.items)
             //console.log("LUMAPPS CONTENT ITEMS " + JSON.stringify(res.data.items))
             
           })
           
           .catch(err => {
             console.log(err)
           })
          
         },[])
         
         console.log("BOOL 1 : " + showUnanswered)
         if(!showUnanswered)
         {
           
     return (
        <>
         <List>
         <ListSubheader>Answered Questions</ListSubheader>
         {contents.map((content) => (
           typeof content.relevantCommentDetails !== "undefined" ? 
           (
               
            <ListItem key={content.id}
            size={Size.huge}
            before={<Avatar image={String(content.authorDetails.profilePictureUrl)} alt="Avatar" size={Size.m} />}
            after={<Button emphasis={Emphasis.low}></Button>}
        >
            <div>
                <span style={{width : '100%', float: 'left'}}><Link href={String(baseUrl.baseUrl + content.url)} target="_blank">{content.title.en}</Link></span>
            </div>
            <div>
                <span className="lumx-color-font-dark-L2 post-block__social" >
                   <b>Answer</b>:  {content.relevantCommentDetails.text.en}
                </span>

                <span style={{width : '100%', float: 'left'}}>
                    <span className="post-block__social">
                    <Button key="button0" emphasis={Emphasis.low} size={Size.s} leftIcon={mdiHeart}>
                    {content.likes}
                    </Button>
                </span>
                <span className="post-block__social">
                    <Button key="button1" emphasis={Emphasis.low} size={Size.s} leftIcon={mdiMessageTextOutline} label="No of comments">
                    {content.comments}
                    </Button>
                </span>
                </span>
            </div>
        </ListItem>
                    
            ) : (

               <p key={content.id}></p>
               
            )
         
         
               ))} 

               
        
      </List>
       </>
     
    
     );
            }    
            if(showUnanswered)
         {
           
     return (
        <>
         <List>
         <ListSubheader>Unanswered Questions</ListSubheader>
         {contents.slice(0, newRes).map((content) => (
           typeof content.relevantCommentDetails == "undefined" ? 
           (
               
            <ListItem key={content.id}
            size={Size.huge}
            before={<Avatar image={String(content.authorDetails.profilePictureUrl)} alt="Avatar" size={Size.m} />}
            after={<Button emphasis={Emphasis.low}></Button>}
        >
            <div>
                <span style={{width : '100%', float: 'left'}}><Link href={String(baseUrl.baseUrl + content.url)} target="_blank">{content.title.en}</Link></span>
            </div>
            <div>
                <span className="lumx-color-font-dark-L2 post-block__social" >
                   
                </span>

                <span style={{width : '100%', float: 'left'}}>
                    <span className="post-block__social">
                    <Button key="button0" emphasis={Emphasis.low} size={Size.s} leftIcon={mdiHeart}>
                    {content.likes}
                    </Button>
                </span>
                <span className="post-block__social">
                    <Button key="button1" emphasis={Emphasis.low} size={Size.s} leftIcon={mdiMessageTextOutline} label="No of comments">
                    {content.comments}
                    </Button>
                </span>
                </span>
            </div>
        </ListItem>
                    
            ) : (

               <p key={content.id}></p>
               
            )
         
         
               ))} 

               
        
      </List>
       </>
     
    
     );
            }    
           
   };
