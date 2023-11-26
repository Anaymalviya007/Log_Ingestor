import React, { useState } from 'react';
import axios from 'axios';

const LogSearch = () => {
  const [searchParams, setSearchParams] = useState({
    level: '',
    message: '',
    resourceId: '',
    traceId: '',
    spanId: '',
    commit: '',
    parentResourceId: '',
    startDate: '',
    endDate: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const queryParams = {};

    
      Object.keys(searchParams).forEach((key) => {
        if (searchParams[key]) {
          queryParams[key] = searchParams[key];
        }
      });


      if (searchParams.startDate && searchParams.endDate) {
        queryParams.start_date = searchParams.startDate;
        queryParams.end_date = searchParams.endDate;
      }

      const response = await axios.get('http://localhost:3000/search', {
        params: queryParams,
      });
      setSearchResults(response.data.logs);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2 className='block uppercase tracking-wide text-gray-700 text-xl font-bold mb-5 ml-2 mt-10 flex justify-center'>Log Search</h2>
      <div class="flex justify-center">
      <form onSubmit={handleSearch} className='"w-full max-w-lg'>
        <div className='flex flex-wrap -mx-3 mb-6'>
          
          <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 ml-3">
              Level
            </label>
            <input
             className='ml-3 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
             type="text"
              value={searchParams.level}
              onChange={(e) =>
                setSearchParams({ ...searchParams, level: e.target.value })
              }
              placeholder="Enter log level..."
            />
        </div>

        <div className='w-full md:w-1/2 px-3'>
          <label class="ml-2 block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
          Message
          </label>  
          <input
            className='ml-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
            type="text"
            value={searchParams.message}
            onChange={(e) =>
              setSearchParams({ ...searchParams, message: e.target.value })
            }
            placeholder="Enter log message or regx"
          />
        </div>

        <div className='w-full md:w-1/2 px-3'>
          <label class="mt-2 block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 ml-2" >
          Resource Id
          </label> 
          <input
            className='ml-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
            type="text"
            value={searchParams.resourceId}
            onChange={(e) =>
              setSearchParams({ ...searchParams, resourceId: e.target.value })
            }
            placeholder="Enter resourceId..."
          />
        </div>


        <div className='w-full md:w-1/2 px-3'>
          <label class="mt-2 block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 ml-2" >
          Trace Id
          </label> 
          <input
            className='ml-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
            type="text"
            value={searchParams.traceId}
            onChange={(e) =>
              setSearchParams({ ...searchParams, traceId: e.target.value })
            }
            placeholder="Enter traceId..."
          />
        </div>

        <div className='w-full md:w-1/2 px-3'>
          <label class="mt-2 block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 ml-2">
          Span Id
          </label> 
          <input
            className='ml-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
            type="text"
            value={searchParams.spanId}
            onChange={(e) =>
              setSearchParams({ ...searchParams, spanId: e.target.value })
            }
            placeholder="Enter spanId..."
          />
          </div>

          <div className='w-full md:w-1/2 px-3'>
          <label class="mt-2 block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 ml-2">
          Commit
          </label> 
          <input
            className='ml-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
            type="text"
            value={searchParams.commit}
            onChange={(e) =>
              setSearchParams({ ...searchParams, commit: e.target.value })
            }
            placeholder="Enter commit..."
          />
        </div>

        <div className='w-full md:w-1/2 px-3'>
          <label class="mt-2 block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 ml-2">
          Start Date
          </label> 
          <input
            className='ml-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
            type="text"
            value={searchParams.startDate}
            onChange={(e) =>
              setSearchParams({ ...searchParams, startDate: e.target.value })
            }
            placeholder="Start Date (YYYY-MM-DD)"
          />
          </div>

          <div className='w-full md:w-1/2 px-3'>
          <label class="mt-2 block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 ml-2">
          End Date
          </label> 
          <input
            className='ml-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
            type="text"
            value={searchParams.endDate}
            onChange={(e) =>
              setSearchParams({ ...searchParams, endDate: e.target.value })
            }
            placeholder="End Date (YYYY-MM-DD)"
          />
          </div>
        
          <div className='w-full md:w-1/2 px-3'>
          <label class="mt-2 block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 ml-2">
          Parent Resource Id
          </label> 
          <input
            className='ml-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
            type="text"
            value={searchParams.parentResourceId}
            onChange={(e) =>
              setSearchParams({ ...searchParams, parentResourceId: e.target.value })
            }
            placeholder="Enter parentResourceId..."
          />
        </div>
        </div>
        <button
         className='ml-2 mb-6 bg-transparent hover:bg-black text-black font-semibold hover:text-white py-2 px-4 border border-black hover:border-transparent rounded'
         type="submit">
          Search Logs
          </button>
       
      </form>
      </div>


      <div className="overflow-x-auto">
        {searchResults.length > 0 ? (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-700 text-left text-xs leading-4 font-medium text-gray-100 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-700 text-left text-xs leading-4 font-medium text-gray-100 uppercase tracking-wider">Level</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-700 text-left text-xs leading-4 font-medium text-gray-100 uppercase tracking-wider">Resource ID</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-700 text-left text-xs leading-4 font-medium text-gray-100 uppercase tracking-wider">Message</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-700 text-left text-xs leading-4 font-medium text-gray-100 uppercase tracking-wider">Trace ID</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-700 text-left text-xs leading-4 font-medium text-gray-100 uppercase tracking-wider">Span ID</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-700 text-left text-xs leading-4 font-medium text-gray-100 uppercase tracking-wider">Commit</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-700 text-left text-xs leading-4 font-medium text-gray-100 uppercase tracking-wider">Metadata</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-700 text-left text-xs leading-4 font-medium text-gray-100 uppercase tracking-wider">Json</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((log, index) => (
                <React.Fragment key={log._id}>
                  <tr
                    className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                  >
                    
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{log.timestamp}</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{log.level}</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{log.resourceId}</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{log.message}</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{log.traceId}</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{log.spanId}</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{log.commit}</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{JSON.stringify(log.metadata)}</td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                      <button
                        onClick={() =>
                          expandedRow === index
                            ? setExpandedRow(null)
                            : setExpandedRow(index)
                        }
                        className="text-blue-600  focus:outline-none bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                      >
                        {expandedRow === index ? '-' : '+'}
                      </button>
                    </td>
                  </tr>
                  {expandedRow === index && (
                    <tr className="bg-gray-200">
                      <td
                        colSpan="8"
                        className="px-6 py-4 border-b border-gray-300"
                      >
                        <pre>{JSON.stringify(log, null, 2)}</pre>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-center">No logs found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogSearch;
