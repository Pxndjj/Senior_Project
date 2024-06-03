"use client"
export default function Restaurant() {
  return (
    <main className="main-content">
    <h1>Restaurant/dashboard</h1>
            <div className="analyse">
                <div className="sales">
                    <div className="status">
                        <div className="info">
                            <h3>Waiting</h3>
                            <h1>30</h1>
                        </div>
                        <div className="progresss">
                            <svg>
                                <circle cx="38" cy="38" r="36"></circle>
                            </svg>
                            <div className="percentage">
                                <p>+81%</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="visits">
                    <div className="status">
                        <div className="info">
                            <h3>Confirm</h3>
                            <h1>20</h1>
                        </div>
                        <div className="progresss">
                            <svg>
                                <circle cx="38" cy="38" r="36"></circle>
                            </svg>
                            <div className="percentage">
                                <p>-48%</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="searches">
                    <div className="status">
                        <div className="info">
                            <h3>Cancel</h3>
                            <h1>10</h1>
                        </div>
                        <div className="progresss">
                            <svg>
                                <circle cx="38" cy="38" r="36"></circle>
                            </svg>
                            <div className="percentage">
                                <p>+21%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="new-users">
                <h2>New Users</h2>
                <div className="user-list">
                    <div className="user">
                        <img src="/images/user-g.svg"/>
                        <h2>Jack</h2>
                        <p>54 Min Ago</p>
                    </div>
                    <div className="user">
                        <img src="/images/user-g.svg"/>
                        <h2>Amir</h2>
                        <p>3 Hours Ago</p>
                    </div>
                    <div className="user">
                        <img src="/images/user-g.svg"/>
                        <h2>Ember</h2>
                        <p>6 Hours Ago</p>
                    </div>
                    <div className="user">
                        <img src="/images/user-g.svg"/>
                        <h2>More</h2>
                        <p>New User</p>
                    </div>
                </div>
            </div> */}
            <div className="queue-list">
                <h2>Queue List</h2>
                <div className="card-table">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th className="name">Name</th>
                            <th>Queue</th>
                            <th>Seat</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr>
                            <td>1</td>
                            <td className="name">boss (087-444-5568)<span className="q-confirm">confirm</span></td>
                            <td>Q-01</td>
                            <td>1</td>
                            <td>Today</td>
                            <td>14.30</td>
                            <td><span className="material-symbols-outlined">more_vert</span></td>
                      </tr> 
                      <tr>
                            <td>2</td>
                            <td className="name">mamioew (089-555-1523) <span className="q-confirm">confirm</span></td>
                            <td>Q-02</td>
                            <td>2</td>
                            <td>Today</td>
                            <td>14.30</td>
                            <td><span className="material-symbols-outlined">more_vert</span></td>
                      </tr>  
                      <tr>
                            <td>3</td>
                            <td className="name">Somsak (084-555-5684)<span className="q-waiting">waiting</span></td>
                            <td>Q-03</td>
                            <td>2</td>
                            <td>Today</td>
                            <td>14.30</td>
                            <td><span className="material-symbols-outlined">more_vert</span></td>
                      </tr> 
                      <tr>
                            <td>4</td>
                            <td className="name">fame (02-288-9455)<span className="q-confirm">confirm</span></td>
                            <td>Q-04</td>
                            <td>2</td>
                            <td>Today</td>
                            <td>14.30</td>
                            <td><span className="material-symbols-outlined">more_vert</span></td>
                      </tr> 
                      <tr>
                            <td>5</td>
                            <td className="name">Pond (089-515-0372)<span className="q-confirm">confirm</span></td>
                            <td>Q-05</td>
                            <td>2</td>
                            <td>Today</td>
                            <td>14.30</td>
                            <td><span className="material-symbols-outlined" >more_vert</span></td>
                      </tr> 
                      <tr>
                            <td>6</td>
                            <td className="name">Mana (057-444-5684)<span className="q-cancel">cancel</span></td>
                            <td>Q-06</td>
                            <td>2</td>
                            <td>Today</td>
                            <td>14.30</td>
                            <td><span className="material-symbols-outlined">more_vert</span></td>
                      </tr> 
                    </tbody>
                </table>
                </div>
                <a href="#">Show All</a>
            </div>            
    </main>
  );
}
