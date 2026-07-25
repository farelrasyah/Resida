<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->enum('category', ['gaji_satpam', 'listrik_utilitas', 'kebersihan', 'perbaikan', 'lainnya']);
            $table->string('description', 255);
            $table->decimal('amount', 12, 2);
            $table->date('expense_date');
            $table->softDeletes();
            $table->timestamps();

            $table->index('category', 'idx_expenses_category');
            $table->index('expense_date', 'idx_expenses_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
