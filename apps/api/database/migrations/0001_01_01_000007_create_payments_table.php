<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_number', 30)->unique('uniq_payments_transaction_number');
            $table->foreignId('house_id')->constrained()->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignId('resident_id')->constrained()->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignId('dues_type_id')->constrained()->restrictOnDelete()->cascadeOnUpdate();
            $table->decimal('amount', 12, 2);
            $table->decimal('total_amount', 12, 2);
            $table->date('payment_date');
            $table->enum('status', ['lunas', 'dibatalkan'])->default('lunas');
            $table->string('notes', 255)->nullable();
            $table->timestamps();

            $table->index('house_id', 'idx_payments_house_id');
            $table->index('resident_id', 'idx_payments_resident_id');
            $table->index('dues_type_id', 'idx_payments_dues_type_id');
            $table->index('status', 'idx_payments_status');
            $table->index(['payment_date', 'status'], 'idx_payments_date_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
