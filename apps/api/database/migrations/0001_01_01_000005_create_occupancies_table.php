<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('occupancies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('house_id')->constrained()->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignId('resident_id')->constrained()->restrictOnDelete()->cascadeOnUpdate();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->timestamps();

            $table->index('house_id', 'idx_occupancies_house_id');
            $table->index('resident_id', 'idx_occupancies_resident_id');
            $table->index(['house_id', 'end_date'], 'idx_occupancies_house_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('occupancies');
    }
};
