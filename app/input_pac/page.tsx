"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function InputPAC() {
  const [formData, setFormData] = useState({
    type_pac: "",
    sn: "",
    kwh: "",
    lokasi: "",
    ruangan: "",
    lantai: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const saveData = async () => {
    setLoading(true);
    setMsg("");

    const { data, error } = await supabase.from("pac_data").insert({
      type_pac: formData.type_pac,
      sn: formData.sn,
      kwh: formData.kwh,
      lokasi: formData.lokasi,
      rak: formData.ruangan,
      lantai: formData.lantai,
    });

    if (error) {
      setMsg(error.message);
    } else {
      setMsg("Data berhasil disimpan!");
      setFormData({
        type_pac: "",
        sn: "",
        kwh: "",
        lokasi: "",
        ruangan: "",
        lantai: "",
      });
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen p-6 flex justify-center items-start"
      style={{
        background:
          "linear-gradient(135deg, #f8cdda 0%, #1d2b64 100%)",
      }}
    >
      <div
        className="w-full max-w-xl p-6 rounded-3xl shadow-2xl backdrop-blur-2xl"
        style={{
          background: "rgba(255, 255, 255, 0.55)",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
      >
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Kane's App Pac
        </h1>

        <div className="grid grid-cols-1 gap-4">
          <MacInput label="PAC Type" name="type_pac" value={formData.type_pac} onChange={handleChange} />
          <MacInput label="Serial Number (SN)" name="sn" value={formData.sn} onChange={handleChange} />
          <MacInput label="KWH" name="kwh" type="text" value={formData.kwh} onChange={handleChange} />
          <MacInput label="Lokasi" name="lokasi" value={formData.lokasi} onChange={handleChange} />
          <MacInput label="Ruangan" name="ruangan" value={formData.ruangan} onChange={handleChange} />
          <MacInput label="Lantai" name="lantai" value={formData.lantai} onChange={handleChange} />
        </div>

        <button
          onClick={saveData}
          disabled={loading}
          className="mt-6 w-full py-3 rounded-2xl font-semibold text-white shadow-lg transition-all"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>

        {msg && (
          <p className="text-center mt-4 text-sm font-medium text-red-700">
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}

function MacInput({ label, name, value, onChange, type = "text" }: any) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium text-black">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="p-3 rounded-2xl shadow-inner outline-none border border-gray-300 focus:border-purple-500 transition-all text-black"
        style={{
          background: "rgba(255,255,255,0.75)",
          WebkitAppearance: "none",
        }}
      />
    </div>
  );
}
