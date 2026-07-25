<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_periods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_id')->constrained()->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignId('house_id')->constrained()->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignId('dues_type_id')->constrained()->restrictOnDelete()->cascadeOnUpdate();
            $table->unsignedSmallInteger('period_year');
            $table->unsignedTinyInteger('period_month');
            $table->timestamps();

            $table->unique(
                ['house_id', 'dues_type_id', 'period_year', 'period_month'],
                'uniq_payment_periods_house_dues_period'
            );
            $table->index('payment_id', 'idx_payment_periods_payment_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_periods');
    }
};
