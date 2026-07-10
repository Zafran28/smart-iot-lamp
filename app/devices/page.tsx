"use client";

import { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import { supabase } from "../lib/supabase";

type ESP = { ip: string; connected: boolean };

export default function Home() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [espIP, setEspIP] = useState("192.168.1.22");
  const [connected, setConnected] = useState(false);
  const [espList, setEspList] = useState<ESP[]>([]);
  const [scanning, setScanning] = useState(false);
  const [loadingRelay, setLoadingRelay] = useState<number | null>(null);

  const [devices, setDevices] = useState([false,false,false,false,false,false]);
  const [names, setNames] = useState([
    "Lampu Ruang Tamu","Lampu Kamar","Lampu Dapur","Kipas","AC","Stop Kontak"
  ]);

  const [editIndex,setEditIndex]=useState<number|null>(null);
  const [editValue,setEditValue]=useState("");

  // 🔥 GET USER LOGIN
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data.user?.email ?? null);
    };

    getUser();
  }, []);

  useEffect(()=>{
    const ip=localStorage.getItem("esp_ip");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if(ip) setEspIP(ip);

    const saved=localStorage.getItem("relay_names");
    if(saved) setNames(JSON.parse(saved));
  },[]);

  useEffect(()=>{
    if(!espIP) return;

    const check=async()=>{
      try{
        const ping=await fetch(`http://${espIP}/ping`,{cache:"no-store"});
        if(!ping.ok){setConnected(false);return;}

        setConnected(true);

        const res=await fetch(`http://${espIP}/status`,{cache:"no-store"});
        if(res.ok){
          const d=await res.json();
          setDevices([
            !!d.relay1,
            !!d.relay2,
            !!d.relay3,
            !!d.relay4,
            !!d.relay5,
            !!d.relay6
          ]);
        }
      }catch{
        setConnected(false);
      }
    };

    check();
    const t=setInterval(check,1000);
    return()=>clearInterval(t);
  },[espIP]);

  const scanESP=async()=>{
    setScanning(true);
    setEspList([]);

    await Promise.all(
      Array.from({length:39},(_,k)=>k+2).map(async(i)=>{
        const ip=`192.168.1.${i}`;
        try{
          const c=new AbortController();
          const to=setTimeout(()=>c.abort(),1000);

          const r=await fetch(`http://${ip}/ping`,{
            signal:c.signal,
            cache:"no-store"
          });

          clearTimeout(to);

          if(r.ok){
            setEspList(p=>p.some(x=>x.ip===ip)?p:[...p,{ip,connected:true}]);
          }
        }catch{}
      })
    );

    setScanning(false);
  };

  const toggleRelay=async(index:number)=>{
    const next=!devices[index];

    try{
      setLoadingRelay(index);

      const r=await fetch(
        `http://${espIP}/relay?id=${index+1}&state=${next?1:0}`
      );

      if(!r.ok) throw new Error();

      setDevices(p=>{
        const c=[...p];
        c[index]=next;
        return c;
      });

    }catch{
      alert("ESP8266 tidak merespon");
    }finally{
      setLoadingRelay(null);
    }
  };

  const allSet=async(state:boolean)=>{
    try{
      const r=await fetch(
        `http://${espIP}/${state?"allon":"alloff"}`
      );

      if(!r.ok) throw new Error();

      setDevices(Array(6).fill(state));

    }catch{
      alert("ESP8266 tidak merespon");
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <main className="min-h-screen bg-[#0B1220] text-white pb-24">

      <div className="p-6">

        {/* 🔥 USER INFO HEADER */}
       <div className="flex justify-end mb-6">
          <div className="bg-linear-to-r from-[#1B2537] to-[#111827] border border-slate-700 rounded-2xl px-5 py-4 flex items-center gap-4 shadow-lg w-fit">
            <div>
              <h2 className="text-lg font-semibold">
                👤 {userEmail || "Guest"}
              </h2>
              <p className="text-sm text-gray-400">
                     Smart Home User
              </p>
            </div>

            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        <h1 className="text-3xl font-bold">Floora Smart Home</h1>
        <p className="text-gray-400">ESP8266 Multi Control</p>

        {/* SCAN */}
        <div className="mt-5 bg-[#161F2F] p-4 rounded-xl">
          <button onClick={scanESP} className="w-full bg-blue-600 py-2 rounded">
            {scanning ? "Scanning..." : "🔍 Scan ESP8266"}
          </button>

          <div className="mt-3 space-y-2">
            {espList.map(e=>(
              <button
                key={e.ip}
                onClick={()=>{
                  setEspIP(e.ip);
                  localStorage.setItem("esp_ip",e.ip);
                }}
                className={`w-full p-2 rounded ${
                  espIP===e.ip ? "bg-green-600" : "bg-slate-800"
                }`}
              >
                📡 {e.ip}
              </button>
            ))}
          </div>
        </div>

        {/* STATUS */}
        <div className="mt-5 bg-[#161F2F] p-4 rounded-xl">
          <p>{espIP}</p>
          <p className={connected?"text-green-400":"text-red-400"}>
            {connected ? "Connected" : "Disconnected"}
          </p>
        </div>

        {/* DEVICES */}
        <div className="grid gap-4 mt-6">
          {devices.map((on,i)=>(
            <div key={i} className="bg-[#161F2F] p-4 rounded-xl flex justify-between">

              <div>
                {editIndex===i ? (
                  <div className="flex gap-2">
                    <input
                      className="text-black px-2"
                      value={editValue}
                      onChange={e=>setEditValue(e.target.value)}
                    />

                    <button
                      className="bg-green-600 px-2 rounded"
                      onClick={()=>{
                        const n=[...names];
                        n[i]=editValue;
                        setNames(n);
                        localStorage.setItem("relay_names",JSON.stringify(n));
                        setEditIndex(null);
                      }}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <h2>{names[i]}</h2>
                    <p>{on ? "ON" : "OFF"}</p>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  className="bg-yellow-600 px-2 rounded"
                  onClick={()=>{
                    setEditIndex(i);
                    setEditValue(names[i]);
                  }}
                >
                  Edit
                </button>

                <button
                  disabled={loadingRelay===i}
                  className={`px-4 rounded ${
                    on ? "bg-green-600" : "bg-gray-700"
                  }`}
                  onClick={()=>toggleRelay(i)}
                >
                  {on ? "ON" : "OFF"}
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* ALL CONTROL */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <button onClick={()=>allSet(true)} className="bg-green-600 py-3 rounded">
            ALL ON
          </button>

          <button onClick={()=>allSet(false)} className="bg-red-600 py-3 rounded">
            ALL OFF
          </button>
        </div>

      </div>

      <BottomNav/>
    </main>
  );
}