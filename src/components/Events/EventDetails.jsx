import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Header from '../Header.jsx';
import { useQuery,useMutation } from '@tanstack/react-query';
import { fetchEvent } from '../../util/http.js';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import { deleteEvent } from '../../util/http.js';
import { queryClient } from '../../util/http.js';
export default function EventDetails() {
  const params = useParams();
  const navigate = useNavigate()
  const {data,isPending,isError,error} =  useQuery({
      queryKey:['events',params.id],
      queryFn:({signal}) => fetchEvent({signal,id:params.id}),
    })

 const {mutate } =  useMutation({
             mutationFn:deleteEvent,
             onSuccess:()=>{
                queryClient.invalidateQueries({queryKey:['events']})
           navigate('/events')
             }
      })

      function handleDelete () {
        mutate({id:params.id})
      }
    

      let content =  <p>Please enter a search term to find events.</p>
      if(isPending){
        content = <LoadingIndicator />
      }
    
      if(isError){
        content =  <ErrorBlock title="An Error Occurred" message={error.info?.message || "Failed to fetch events"} />
      }


      if (data){
          const formattedDate = new Date(data.date).toLocaleDateString(
            "en-US",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
            }
          );
content = (
  <>
    <header>
      <h1>{data.title}</h1>
      <nav>
        <button onClick={handleDelete}>Delete</button>
        <Link to="edit">Edit</Link>
      </nav>
    </header>
    <div id="event-details-content">
      <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
      <div id="event-details-info">
        <div>
          <p id="event-details-location">{data.location}</p>
          <time dateTime={`Todo-DateT$Todo-Time`}>
            {formattedDate} @ {data.time}
          </time>
        </div>
        <p id="event-details-description">{data.descripton}</p>
      </div>
    </div>
  </>
);
  }


  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
         {content}
       
      </article>
    </>
  );
}
