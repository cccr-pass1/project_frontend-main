import { useEffect, useState } from "react";
import { getMemberList } from "../../api/MemberApi";

function Member(){

    const [listData, setListData] = useState([])
    const callApi = async ()=> {
        try {
            const restaurants = await getMemberList()            
            console.log(restaurants);
            setListData(restaurants.data)
        } catch (error) {
            console.log("error ::: ", error);
        }
    }
    useEffect(()=>{
        callApi()
    }, [])


    return(
        <>
            {
                listData?.map(function(item, i){
                    return(
                        <li key={i}><a href={`/member/${item.id}`}>{item.name}</a></li>
                    )
                })
            }
        </>
    )
}

export default Member;