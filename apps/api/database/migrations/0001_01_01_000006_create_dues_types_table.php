<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dues_types', function (Blueprint $table) {
            $table->id();
            $table->enum('code', ['satpam', 'kebersihan'])->unique('uniq_dues_types_code');
            $table->string('name', 100);
            $table->decimal('amount', 12, 2);
            $table->enum('default_frequency', ['bulanan', 'tahunan']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dues_types');
    }
};
