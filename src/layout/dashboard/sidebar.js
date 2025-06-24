import { useState } from "react"; 
import Search from "../../components/search";
import UsersList from "../../components/usersList";

function Sidebar({socket, isOnline}){

    const [searchKey, setSearchKey] = useState('');

    return(
        <div className="app-sidebar">
            <Search searchKey={searchKey}  setSearchKey={setSearchKey} />
            <UsersList searchKey={searchKey} socket={socket} isOnline={isOnline} />
        </div>
    )
}
export default Sidebar;
