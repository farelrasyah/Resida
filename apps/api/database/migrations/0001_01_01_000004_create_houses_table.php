<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('houses', function (Blueprint $table) {
            $table->id();
            $table->string('house_number', 50)->unique('uniq_houses_house_number');
            $table->enum('occupancy_status', ['dihuni', 'tidak_dihuni'])->default('tidak_dihuni');
            $table->softDeletes();
            $table->timestamps();

            $table->index('occupancy_status', 'idx_houses_occupancy_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('houses');
    }
};
