// components/PacForm.tsx

'use client'; // WAJIB ADA karena menggunakan hooks seperti useState, useForm, useEffect

import { PacSchemaType, pacSchema } from '@/schemas/pacSchema';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { PacData } from '@/types/pac';

interface PacFormProps {
  type: 'create' | 'update';
  pacId?: string; // Hanya ada jika type === 'update'
}

// Gunakan fungsi panah (arrow function) dengan tipe React.FC
const PacForm: React.FC<PacFormProps> = ({ type, pacId }) => {
  const router = useRouter();
  const [loadingInitial, setLoadingInitial] = useState(type === 'update');
  const isUpdate = type === 'update';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PacSchemaType>({
    resolver: zodResolver(pacSchema),
    defaultValues: {
      type_pac: '',
      sn: '',
      kwh: 0,
      lokasi: '',
      lantai: 0,
      rak: '',
    },
  });

  // Fetch data untuk mode Update (EDIT)
  useEffect(() => {
    if (isUpdate && pacId) {
      const fetchPac = async () => {
        setLoadingInitial(true);
        try {
          // Menggunakan API Route Handler yang baru dibuat: /api/pac/get/[id]
          const res = await fetch(`/api/pac/get/${pacId}`); 
          const result = await res.json();

          if (res.ok) {
            const data: PacData = result.data;
            // Mengisi form dengan data yang diambil dari Supabase
            reset({
              type_pac: data.type_pac,
              sn: data.sn,
              kwh: data.kwh,
              lokasi: data.lokasi,
              lantai: data.lantai,
              rak: data.rak,
            });
          } else {
            toast.error(`Gagal memuat data: ${result.message}`);
            router.push('/'); // Redirect jika data tidak ditemukan
          }
        } catch (e) {
          toast.error("Koneksi gagal saat memuat data.");
        } finally {
          setLoadingInitial(false);
        }
      };
      fetchPac();
    }
  }, [isUpdate, pacId, reset, router]);

  const onSubmit = async (data: PacSchemaType) => {
    const method = isUpdate ? 'PUT' : 'POST';
    const url = isUpdate ? `/api/pac/update?id=${pacId}` : '/api/pac/create';

    const actionToast = toast.loading(isUpdate ? 'Mengupdate data...' : 'Menambahkan data...');

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message, { id: actionToast });
        router.push('/'); // Kembali ke dashboard
        router.refresh(); // Refresh data dashboard
      } else {
        // Handle error seperti SN duplikat (status 409)
        toast.error(result.message || 'Gagal menyimpan data.', { id: actionToast });
      }
    } catch (e) {
      toast.error(`Koneksi gagal: ${(e as Error).message}`, { id: actionToast });
    }
  };

  if (loadingInitial) {
    return <div className="text-center py-8 text-gray-500">Memuat data PAC...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Type PAC"
        type="text"
        {...register('type_pac')}
        error={errors.type_pac?.message}
      />
      <Input
        label="Serial Number (SN) - Harus Unik"
        type="text"
        {...register('sn')}
        error={errors.sn?.message}
      />
      <Input
        label="Nilai kWh (Angka)"
        type="number"
        step="1"
        {...register('kwh', { valueAsNumber: true })}
        error={errors.kwh?.message}
      />
      <Input
        label="Lokasi Penempatan PAC"
        type="text"
        {...register('lokasi')}
        error={errors.lokasi?.message}
      />
      <Input
        label="Posisi Lantai (Angka)"
        type="number"
        step="1"
        {...register('lantai', { valueAsNumber: true })}
        error={errors.lantai?.message}
      />
      <Input
        label="Nama/Kode Rak"
        type="text"
        {...register('rak')}
        error={errors.rak?.message}
      />

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        {isUpdate ? '💾 Save Changes' : '➕ Tambahkan Data'}
      </Button>
    </form>
  );
};

// WAJIB: Default export komponen
export default PacForm;