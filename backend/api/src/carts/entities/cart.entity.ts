import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  salePrice?: number;
  quantity: number;
  imageUrl?: string;
}

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'ID único do carrinho' })
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  @ApiProperty({ description: 'Usuário dono do carrinho' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'storeId' })
  @ApiProperty({ description: 'Loja à qual o carrinho pertence' })
  store: Tenant;

  @Column()
  storeId: string;

  @Column({ type: 'json' })
  @ApiProperty({ description: 'Itens no carrinho' })
  items: CartItem[];

  @CreateDateColumn()
  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Data da última atualização' })
  updatedAt: Date;
} 