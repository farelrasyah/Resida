<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('residents', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('ktp_photo_path');
            $table->enum('resident_status', ['kontrak', 'tetap']);
            $table->string('phone_number', 20);
            $table->enum('marital_status', ['sudah_menikah', 'belum_menikah']);
            $table->softDeletes();
            $table->timestamps();

            $table->index('resident_status', 'idx_residents_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('residents');
    }
};
